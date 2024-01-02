import {
  type BaseUnifiedGame,
  type CalculatedPlayerMessage,
  groupBy,
  type Role,
  type UnifiedGame,
  type UnifiedGameComputed,
} from "@hidden-identity/shared";
import { createSelector } from "@reduxjs/toolkit";

import { type AnyGameAction } from "./gameActions.ts";
import {
  createGameReducer,
  type GameStore,
  type GameThunk,
} from "./gameReducer.ts";
import { getOrderedPlayers } from "./gameSelectors.ts";
type Callback<ResourceShape> = (value: ResourceShape | null) => void;

export class GameMachine {
  store: GameStore;
  constructor(preloadedState?: BaseUnifiedGame) {
    if (!preloadedState) {
      this.store = createGameReducer();
    } else {
      const initialStateMinusComputedKeys = { ...preloadedState };
      Object.keys(computedGameSelectors).forEach((key) => {
        // @ts-expect-error I know the keys are there
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete initialStateMinusComputedKeys[key];
      });

      this.store = createGameReducer(
        initialStateMinusComputedKeys as BaseUnifiedGame,
      );
    }
  }
  dispatch<ReturnType>(action: GameThunk<ReturnType>): ReturnType;
  dispatch<Action extends AnyGameAction>(action: Action): Action;

  dispatch<ReturnType>(action: AnyGameAction | GameThunk<ReturnType>) {
    if (typeof action === "function") {
      // Typescript is kinda goofy, and we need to discriminate the union manually...
      return this.store.dispatch(action);
    }
    return this.store.dispatch(action);
  }

  subscribe(callback: Callback<UnifiedGame>): () => void {
    callback(this.getGame());
    return this.store.subscribe(() => {
      const currentState = this.getGame();
      callback(currentState);
    });
  }

  getGame() {
    return gameSelector(this.store.getState());
  }

  undo() {
    return this.store.undo();
  }
}

// could make this more automatic, but would be difficult to keep typesafe.
const gameSelector = createSelector(
  (game: BaseUnifiedGame) => game,
  (game: BaseUnifiedGame) => computedGameSelectors.orderedPlayers(game),
  (game: BaseUnifiedGame) => computedGameSelectors.playerList(game),
  (game: BaseUnifiedGame) => computedGameSelectors.rolesToPlayers(game),
  (game: BaseUnifiedGame) => computedGameSelectors.messagesByNight(game),
  (game, orderedPlayers, playerList, rolesToPlayers, messagesByNight) =>
    ({
      ...game,
      orderedPlayers,
      playerList,
      rolesToPlayers,
      messagesByNight,
    }) satisfies UnifiedGame,
);

export const computedGameSelectors: {
  [Key in keyof UnifiedGameComputed]: (
    game: BaseUnifiedGame,
  ) => UnifiedGameComputed[Key];
} = {
  orderedPlayers: createSelector(
    (game: BaseUnifiedGame) => game.partialPlayerOrdering,
    (players) => getOrderedPlayers(players),
  ),
  playerList: createSelector(
    (game: BaseUnifiedGame) => game.playersToRoles,
    (players) => Object.keys(players).sort(),
  ),
  rolesToPlayers: createSelector(
    (game: BaseUnifiedGame) => game.playersToRoles,
    (players) => {
      const rolesToPlayers: Record<Role, string[]> = {};
      Object.entries(players).forEach(([player, role]) => {
        rolesToPlayers[role] = [...(rolesToPlayers[role] || []), player];
      });
      return rolesToPlayers;
    },
  ),
  messagesByNight: createSelector(
    (game: BaseUnifiedGame) => game.messages,
    (messages) => {
      const messagesAsGroups = messages.map(
        (message) => ({
          ...message,
          messages: groupBy(message.messages, "group"),
        }),
        {},
      );
      const messagesByNight = groupBy(messagesAsGroups, "nightNumber");
      return messagesByNight satisfies Record<
        number,
        CalculatedPlayerMessage[]
      >;
    },
  ),
} satisfies Record<keyof UnifiedGameComputed, any>;
