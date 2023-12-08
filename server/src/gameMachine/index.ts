import { type UnifiedGame } from "@hidden-identity/shared";
import { createStore, combineReducers } from "redux";
import { UNASSIGNED } from "../database/gameDB/base.ts";

function createReducer<Shape>(
  fn: (state: Shape, action: AnyAction) => Shape,
): (state: Shape, action: AnyAction) => Shape {
  return fn;
}

export const gameStore = createStore(
  combineReducers({
    playersToRoles: createReducer<UnifiedGame["playersToRoles"]>(
      (state, action) => {
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
    ),
    partialPlayerOrdering: createReducer<UnifiedGame["partialPlayerOrdering"]>(
      (state, action) => {
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
    ),
    deadPlayers: createReducer<UnifiedGame["deadPlayers"]>((state, action) => {
      switch (action.type) {
        case "AddPlayer":
          return {
            ...state,
            [action.player]: false,
          };
        default:
          return state;
      }
    }),
    travelers: createReducer<UnifiedGame["travelers"]>((state, action) => {
      switch (action.type) {
        case "AddPlayer":
          return {
            ...state,
            // Should make this automatic if game started.
            [action.player]: !!action.traveling,
          };
        default:
          return state;
      }
    }),
    alignmentsOverrides: createReducer<UnifiedGame["alignmentsOverrides"]>(
      (state, action) => {
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
    ),
    // gmSecretHash: () => "",
    // gameStatus: () => "Finished",
    // nextGameId: () => "",
    // playerPlayerStatuses: () => ({}),
    // playerNotes: () => ({}),
    // deadVotes: () => ({}),
    // onTheBlock: () => ({}),
    // roleBag: () => ({}),
    // playersSeenRoles: () => [],
  }),
);

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
