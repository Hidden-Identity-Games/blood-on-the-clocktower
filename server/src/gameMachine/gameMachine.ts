import {
  type UnifiedGame,
  type BaseUnifiedGame,
  type UnifiedGameComputed,
  type Role,
  groupBy,
  type CalculatedPlayerMessage,
} from "@hidden-identity/shared";
import { type GameReducer, createGameReducer } from "./gameReducer.ts";
import { createSelector } from "@reduxjs/toolkit";
import { getOrderedPlayers } from "./gameSelectors.ts";
import { type Dispatchable } from "./gameActions.ts";
type Callback<ResourceShape> = (value: ResourceShape | null) => void;

export class GameMachine {
  store: GameReducer;
  constructor(initialState?: BaseUnifiedGame) {
    const initialStateMinusComputedKeys = { ...initialState };
    Object.keys(computedGameSelectors).forEach((key) => {
      // @ts-expect-error I know the keys are there
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete initialStateMinusComputedKeys[key];
    });

    this.store = createGameReducer(
      initialStateMinusComputedKeys as BaseUnifiedGame,
    );
  }

  dispatch(action: Dispatchable) {
    // TODO: fix these types
    this.store.dispatch(action as any);
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

const computedGameSelectors = {
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
