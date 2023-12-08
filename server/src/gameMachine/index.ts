import { type BaseUnifiedGame } from "@hidden-identity/shared";
import {
  configureStore,
  type EnhancedStore,
  type StoreEnhancer,
  type ThunkDispatch,
  type UnknownAction,
} from "@reduxjs/toolkit";
import { UNASSIGNED } from "../database/gameDB/base.ts";

// Needed so things can read the type of gameStore
export type { EnhancedStore, StoreEnhancer, ThunkDispatch, UnknownAction };

export const gameStore = configureStore<Partial<BaseUnifiedGame>, AnyAction>({
  reducer: {
    playersToRoles: (state = {}, action) => {
      switch (action.type) {
        case "AddPlayer":
          return {
            ...state,
            [action.player]: UNASSIGNED,
          };
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
        default:
          return state;
      }
    },

    deadPlayers: (state = {}, action) => {
      switch (action.type) {
        case "AddPlayer":
          return {
            ...state,
            [action.player]: false,
          };
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
        default:
          return state;
      }
    },

    // gmSecretHash: () => "",
    // gameStatus: () => "Finished",
    // nextGameId: () => "",
    // playerPlayerStatuses: () => ({}),
    // playerNotes: () => ({}),
    // deadVotes: () => ({}),
    // onTheBlock: () => ({}),
    // roleBag: () => ({}),
    // playersSeenRoles: () => [],
  },
});

type ActionName = "AddPlayer";

type Action<ActionType extends ActionName, AdditonalProperties> = {
  type: ActionType;
} & AdditonalProperties;

interface PlayerActionProperties {
  player: string;
  traveling?: boolean;
}
type AddPlayerAction = Action<"AddPlayer", PlayerActionProperties>;

type AnyAction = AddPlayerAction;

// type GameType = ReturnType<typeof gameStore.getState>;
