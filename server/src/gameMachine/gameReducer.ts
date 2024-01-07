import {
  type ActionQueueItem,
  type AppliedPlayerReminder,
  type BaseUnifiedGame,
  generateThreeWordId,
  getAbility,
  getCharacter,
  getReminder,
  removeKey,
  type Role,
  shuffleList,
  toEntries,
} from "@hidden-identity/shared";
import { generate } from "random-words";

import { UNASSIGNED } from "../database/gameDB/base.ts";
import { type ActionMap, type AnyGameAction } from "./gameActions.ts";
import { combineReducers } from "./reduxEnhacers/combineReducers.ts";
import {
  createStore,
  type InitAction,
  type Store,
  type Thunk,
} from "./reduxEnhacers/reduxImplementation.ts";

export type GameStore = Store<BaseUnifiedGame, AnyGameAction>;
export type Action<ActionType extends keyof ActionMap> = AnyGameAction & {
  type: ActionType;
};

export type GameThunk<ReturnType> = Thunk<
  ReturnType,
  BaseUnifiedGame,
  AnyGameAction
>;
export type { AnyGameAction, BaseUnifiedGame };
export function createGameReducer(initialState?: BaseUnifiedGame): GameStore {
  return createStore(
    combineReducers<BaseUnifiedGame, AnyGameAction | InitAction>({
      playersToRoles: (state = {}, action) => {
        switch (action.type) {
          case "AddPlayer":
            return {
              ...state,
              [action.player]: UNASSIGNED,
            };
          case "KickPlayer":
            return removeKey(state, action.player);
          case "ChangePlayerRole":
          case "DrawRole":
            return {
              ...state,
              [action.player]: action.role,
            };
          default:
            return state;
        }
      },
      time: (state = { time: "day", count: 0 }, action) => {
        switch (action.type) {
          case "StartDay":
            return {
              time: "day",
              count: state.count,
            };
          case "StartNight": {
            return {
              time: "night",
              count: state.count + 1,
            };
          }
          default:
            return state;
        }
      },
      actionQueue: (state = [], action, wholePreviousState) => {
        switch (action.type) {
          case "StartDay":
            return [];
          case "StartNight":
            return action.initialActionQueue;
          case "CompleteAction":
            return state.map((item) =>
              item.id === action.itemId
                ? ({ ...item, status: "done" } satisfies ActionQueueItem)
                : item,
            );
          case "KillPlayer":
            return state.map((current) =>
              "player" in current && current.player === action.player
                ? ({ ...current, status: "skip" } satisfies ActionQueueItem)
                : current,
            );
          // When we add a new ability in, we add all abilities to the queue.
          case "ChangePlayerRole":
          case "RevivePlayer": {
            const pastRole = wholePreviousState?.playersToRoles[action.player];
            const nextRole =
              action.type === "ChangePlayerRole" ? action.role : pastRole;
            const ability = getAbility(nextRole, wholePreviousState.time);
            if (!ability) {
              return state;
            }

            // The current player changed roles, skip their current actions.
            const nextQueue = state.map((current) =>
              current.player === action.player
                ? ({
                    ...current,
                    status: "notInGame",
                  } satisfies ActionQueueItem)
                : current,
            );
            const firstGreaterIndex = nextQueue.findIndex(
              (current) => current.order > ability.order,
            );
            const insertBefore =
              firstGreaterIndex === -1 ? nextQueue.length : firstGreaterIndex;
            return [
              ...nextQueue.slice(0, insertBefore),
              {
                id: generateThreeWordId(),
                order: ability.order,
                player: action.player,
                status: "todo",
                role: nextRole,
                type: "character",
              } satisfies ActionQueueItem,
              ...nextQueue.slice(insertBefore),
            ];
          }
          default:
            return state;
        }
      },
      partialPlayerOrdering: (state = {}, action) => {
        switch (action.type) {
          case "AddPlayer":
            return {
              ...state,
              [action.player]: { rightNeighbor: null },
            };
          case "SetNeighbor": {
            return {
              ...state,
              [action.player]: { rightNeighbor: action.newRightNeighbor },
            };
          }
          // When kicking, extract from the circle
          case "ExtractPlayerFromCircle":
          case "KickPlayer": {
            const { [action.player]: kickedPlayerNeighbor, ...nextState } =
              state;
            const oprhanedNeighbor = toEntries(nextState).find(
              ([_, value]) => value?.rightNeighbor === action.player,
            );
            if (oprhanedNeighbor) {
              return {
                ...nextState,
                [oprhanedNeighbor[0]]: {
                  rightNeighbor: kickedPlayerNeighbor?.rightNeighbor ?? null,
                },
              };
            } else {
              return nextState;
            }
          }
          case "PlacePlayerInCircle": {
            const { newRightNeighbor } = action;
            const newLeftNeighborEntry = toEntries(state).find(
              ([_, neighbors]) => neighbors?.rightNeighbor === newRightNeighbor,
            );
            return {
              ...state,
              ...(newLeftNeighborEntry
                ? {
                    [newLeftNeighborEntry[0]]: {
                      rightNeighbor: action.player,
                    },
                  }
                : {}),
              [action.player]: { rightNeighbor: newRightNeighbor },
            };
          }
          default:
            return state;
        }
      },
      deadPlayers: (state = {}, action) => {
        switch (action.type) {
          case "RevivePlayer":
          case "AddPlayer":
            return {
              ...state,
              [action.player]: false,
            };
          case "KillPlayer":
            return {
              ...state,
              [action.player]: true,
            };
          case "KickPlayer":
            return removeKey(state, action.player);
          default:
            return state;
        }
      },
      travelers: (state = {}, action) => {
        switch (action.type) {
          case "AddPlayer":
            return {
              ...state,
              [action.player]: !!action.traveling,
            };
          case "KickPlayer":
            return removeKey(state, action.player);
          default:
            return state;
        }
      },
      alignmentsOverrides: (state = {}, action) => {
        switch (action.type) {
          case "AddPlayer":
            return {
              ...state,
              // Should make this automatic if game started.
              ...(action.traveling && { [action.player]: "Good" }),
            };
          case "KickPlayer":
            return removeKey(state, action.player);
          case "OverrideAlignment":
            return {
              ...state,
              [action.player]: action.newAlignment,
            };
          default:
            return state;
        }
      },
      gmSecretHash: (state, action) => {
        switch (action.type) {
          case "MakeIntoTestGame":
            return "t";
          default:
            return state ?? generate(3).join(",");
        }
      },
      gameStatus: (state = "PlayersJoining", action) => {
        switch (action.type) {
          case "StartNight":
            return "Started";
          case "ManuallysetStatus":
            return action.status;
          case "FillRoleBag":
            return "Setup";
          case "DrawRole":
            if (action.isLastRole) {
              return "Setup";
            }
            return state;
          default:
            return state;
        }
      },
      nextGameId: (state = "", action) => {
        switch (action.type) {
          case "MakeNewGame":
            return action.nextGameId;
          default:
            return state;
        }
      },
      playerNotes: (state = {}, action) => {
        switch (action.type) {
          case "AddPlayer":
            return {
              ...state,
              [action.player]: "",
            };
          case "KickPlayer":
            return removeKey(state, action.player);
          case "UpdateNote":
            return {
              ...state,
              [action.player]: action.newNote,
            };
          default:
            return state;
        }
      },
      deadVotes: (state = {}, action) => {
        switch (action.type) {
          // by default no dead vote used.
          case "KillPlayer":
          case "RevivePlayer":
          case "GiveBackDeadVote":
          case "AddPlayer":
            return {
              ...state,
              [action.player]: false,
            };
          case "UseDeadVote":
            return {
              ...state,
              [action.player]: true,
            };
          case "KickPlayer":
            return removeKey(state, action.player);
          default:
            return state;
        }
      },
      script: (state = [], action) => {
        switch (action.type) {
          case "SetScript":
            return action.script;
          case "AddRoleToScript":
            return [...state, { id: action.role }];
          default:
            return state;
        }
      },
      roleBag: (state = {}, action) => {
        switch (action.type) {
          case "DrawRole":
            return removeKey(state, action.roleNumber);
          case "FillRoleBag": {
            return shuffleList(action.roles).reduce<
              Record<number, Role | null>
            >(
              (acc, item, idx) => ({
                ...acc,
                [idx + 1]: item,
              }),
              {},
            );
          }
          default:
            return state;
        }
      },
      playersSeenRoles: (state = [], action) => {
        switch (action.type) {
          case "SeenRole":
            return [...state, action.player];
          default:
            return state;
        }
      },
      onTheBlock: (state = {}, action) => {
        switch (action.type) {
          case "SetVotesToExecute":
            return {
              ...state,
              [action.player]: action.votesToExecute,
            };
          case "ClearVotesToExecute":
            return {};
          case "StartDay":
            return {};
          default:
            return state;
        }
      },
      messages: (state = [], action) => {
        switch (action.type) {
          case "CreateMessage":
            return [...state, action.message];
          case "DeleteMessage":
            return state.filter((message) => message.id !== action.messageId);
          default:
            return state;
        }
      },
      reminders: (state = [], action, wholePreviousState) => {
        switch (action.type) {
          case "DrawRole":
            return [
              ...state,
              ...(getCharacter(action.role).setupReminders ?? [])
                .map((reminder) => getReminder(reminder))
                .map(
                  (reminder) =>
                    ({
                      name: reminder.name,
                      fromPlayer: action.player,
                      toPlayer: action.player,
                      active: true,
                      id: generateThreeWordId(),
                      startNight: wholePreviousState.time.count,
                    }) satisfies AppliedPlayerReminder,
                ),
            ];
          case "ChangePlayerRole":
            return [
              ...state.map((reminder) =>
                reminder.fromPlayer === action.player
                  ? { ...reminder, active: false }
                  : reminder,
              ),
              ...(getCharacter(action.role).setupReminders ?? [])
                .map((reminder) => getReminder(reminder))
                .map(
                  (reminder) =>
                    ({
                      name: reminder.name,
                      fromPlayer: action.player,
                      toPlayer: action.player,
                      active: true,
                      id: generateThreeWordId(),
                      startNight: wholePreviousState.time.count,
                    }) satisfies AppliedPlayerReminder,
                ),
            ];
          case "KickPlayer":
            return state.filter(
              (reminder) =>
                reminder.fromPlayer !== action.player &&
                reminder.toPlayer !== action.player,
            );
          case "AddPlayerReminder":
            return [...state, action.reminder];
          case "ClearPlayerReminder":
            return state.map((reminder) =>
              reminder.id === action.reminderId
                ? { ...reminder, active: false }
                : reminder,
            );
          default:
            return state;
        }
      },
    }),

    initialState,
  );
}
