import {
  type ActionQueueItem,
  type Alignment,
  type AppliedPlayerReminder,
  type GameStatus,
  generateThreeWordId,
  getAbility,
  getCharacter,
  type PlayerMessage,
  type PlayerMessageEntry,
  type PlayerReminder,
  type Role,
} from "@hidden-identity/shared";

import { computedGameSelectors } from "./gameMachine.ts";
import { type GameThunk } from "./gameReducer.ts";

type Action<ActionType extends string, AdditonalProperties> = {
  type: ActionType;
} & AdditonalProperties;

interface PlayerActionProperties {
  player: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NoAdditionalProperties {}

export interface ActionMap {
  AddPlayer: PlayerActionProperties & { traveling?: boolean };
  KickPlayer: PlayerActionProperties;
  ChangePlayerRole: PlayerActionProperties & {
    role: Role;
  };
  DrawRole: PlayerActionProperties & {
    role: Role;
    roleNumber: number;
    isLastRole: boolean;
  };
  SeenRole: PlayerActionProperties;
  FillRoleBag: { roles: Role[] };
  SetNeighbor: PlayerActionProperties & { newRightNeighbor: string | null };
  ExtractPlayerFromCircle: PlayerActionProperties;
  PlacePlayerInCircle: PlayerActionProperties & { newRightNeighbor: string };
  KillPlayer: PlayerActionProperties;
  RevivePlayer: PlayerActionProperties;
  UseDeadVote: PlayerActionProperties;
  GiveBackDeadVote: PlayerActionProperties;
  UpdateNote: PlayerActionProperties & { newNote: string };
  OverrideAlignment: PlayerActionProperties & { newAlignment: Alignment };
  AddPlayerReminder: { reminder: AppliedPlayerReminder };
  ClearPlayerReminder: { reminderId: string };
  SetVotesToExecute: PlayerActionProperties & { votesToExecute: number };
  // probably move this into something that starts the night
  ClearVotesToExecute: NoAdditionalProperties;
  MakeIntoTestGame: NoAdditionalProperties;
  ManuallysetStatus: { status: GameStatus };
  MakeNewGame: { nextGameId: string };
  CreateMessage: PlayerActionProperties & { message: PlayerMessage };
  DeleteMessage: { messageId: string };

  StartDay: NoAdditionalProperties;
  StartNight: { initialActionQueue: ActionQueueItem[] };
  CompleteAction: { itemId: string };
}

export type AnyGameAction = {
  [K in keyof ActionMap]: Action<K, ActionMap[K]>;
}[keyof ActionMap];

export type Dispatchable = AnyGameAction | GameThunk<any>;

export function drawRoleAction({
  roleNumber,
  player,
}: {
  roleNumber: number;
  player: string;
}): GameThunk<boolean> {
  return (dispatch, getGame) => {
    if (getGame().roleBag[roleNumber]) {
      dispatch({
        type: "DrawRole",
        player,
        roleNumber,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        role: getGame().roleBag[roleNumber]!,
        isLastRole: Object.keys(getGame().roleBag).length === 1,
      });

      return true;
    }
    return false;
  };
}

export function progressTimeAction(): GameThunk<void> {
  return (dispatch, getGame) => {
    if (getGame().time.time === "day") {
      const isFirstDay = getGame().time.count === 0;
      const actionsForRoles = Object.values(
        getGame().playersToRoles ?? [],
      ).flatMap((role) => {
        const ability = getAbility(
          role,
          isFirstDay ? { time: "night", count: 1 } : getGame().time,
        );
        if (!ability) {
          return [];
        }
        const playersInRole = computedGameSelectors.rolesToPlayers(getGame())[
          role
        ];

        if (playersInRole.length > 0) {
          return playersInRole.map(
            (player) =>
              ({
                id: generateThreeWordId(),
                player,
                order: ability.order,
                skipped: getGame().deadPlayers[player],
                role,
                type: "character",
              }) as ActionQueueItem,
          );
        }

        return [
          {
            id: generateThreeWordId(),
            player: "",
            order: ability.order,
            skipped: true,
            role,
            type: "character",
          } as ActionQueueItem,
        ];
      });
      const gameActions = isFirstDay
        ? [
            ...Object.keys(getGame().playersToRoles)
              .filter(
                (player) =>
                  getCharacter(getGame().playersToRoles[player]).team ===
                  "Demon",
              )
              .map(
                () =>
                  ({
                    type: "game",
                    actionType: "DEMON",
                    id: generateThreeWordId(),
                    order: 7,
                    skipped: false,
                  }) as ActionQueueItem,
              ),
            {
              type: "game",
              actionType: "MINIONS",
              id: "MINIONS",
              order: 8,
              skipped: false,
            } as ActionQueueItem,
          ]
        : [];

      dispatch({
        type: "StartNight",
        // TODO: Move script into game, and generate this from script instead.
        initialActionQueue: [...actionsForRoles, ...gameActions].sort(
          (a, b) => a.order - b.order,
        ),
      });
    } else {
      dispatch({ type: "StartDay" });
    }
  };
}

export function createMessageAction({
  player,
  messages,
}: {
  player: string;
  messages: PlayerMessageEntry[];
}): GameThunk<string> {
  return (dispatch, getGame) => {
    const id = generateThreeWordId();

    dispatch({
      type: "CreateMessage",
      message: {
        player,
        id,
        nightNumber: getGame().time.count,
        showState: "needs to be shown",
        messages,
      },
      player,
    });

    return id;
  };
}

export function addReminderAction({
  reminder,
}: {
  reminder: PlayerReminder;
}): GameThunk<string> {
  return (dispatch, getGame) => {
    const id = generateThreeWordId();

    dispatch({
      type: "AddPlayerReminder",
      reminder: {
        ...reminder,
        id,
        active: true,
        startNight: getGame().time.count,
      },
    });

    return id;
  };
}
