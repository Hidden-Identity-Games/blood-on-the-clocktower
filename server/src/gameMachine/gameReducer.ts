import {
  type BaseUnifiedGame,
  removeKey,
  type Role,
  shuffleList,
  toEntries,
} from "@hidden-identity/shared";
import {
  type EnhancedStore,
  type Middleware,
  type StoreEnhancer,
  type ThunkAction,
  type ThunkDispatch,
  type Tuple,
  type UnknownAction,
} from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { generate } from "random-words";

import { UNASSIGNED } from "../database/gameDB/base.ts";
import { type ActionMap, type AnyAction } from "./gameActions.ts";

// Needed so things can read the type of gameStore
export type { EnhancedStore, StoreEnhancer, ThunkDispatch, UnknownAction };
export type GameReducer = ReturnType<typeof createGameReducer>;
export type Action<ActionType extends keyof ActionMap> = AnyAction & {
  type: ActionType;
};

export type GameThunk<ReturnType> = ThunkAction<
  ReturnType,
  BaseUnifiedGame,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  AnyAction
>;

export function createGameReducer(initialState?: BaseUnifiedGame) {
  return configureStore<
    BaseUnifiedGame,
    AnyAction,
    // Redux thunk types just ignore everything :-/ Need to do it manually
    Tuple<
      [
        Middleware<
          // eslint-disable-next-line @typescript-eslint/ban-types
          ThunkDispatch<BaseUnifiedGame, {}, AnyAction>,
          BaseUnifiedGame,
          // eslint-disable-next-line @typescript-eslint/ban-types
          ThunkDispatch<BaseUnifiedGame, {}, AnyAction>
        >,
      ]
    >
  >({
    preloadedState: initialState,
    reducer: {
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
              count: state.count + 1,
            };
          case "StartNight": {
            return {
              time: "night",
              count: state.count,
            };
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
                    [newLeftNeighborEntry[0]]: { rightNeighbor: action.player },
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
      playerPlayerStatuses: (state = {}, action) => {
        switch (action.type) {
          case "AddPlayer":
            return {
              ...state,
              [action.player]: [],
            };
          case "KickPlayer":
            return removeKey(state, action.player);
          case "AddPlayerStatus":
            return {
              ...state,
              [action.player]: [...state[action.player], action.status],
            };
          case "RemovePlayerStatus":
            return {
              ...state,
              [action.player]: state[action.player].filter(
                (status) => status.id !== action.statusId,
              ),
            };
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
    },
  });
}
