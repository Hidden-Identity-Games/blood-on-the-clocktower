import {
  type Role,
  type Alignment,
  type PlayerStatus,
  type GameStatus,
} from "@hidden-identity/shared";
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
  ChangePlayerRole: PlayerActionProperties & { role: Role };
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
  AddPlayerStatus: PlayerActionProperties & { status: PlayerStatus };
  RemovePlayerStatus: PlayerActionProperties & { statusId: string };
  SetVotesToExecute: PlayerActionProperties & { votesToExecute: number };
  // probably move this into something that starts the night
  ClearVotesToExecute: NoAdditionalProperties;
  MakeIntoTestGame: NoAdditionalProperties;
  ManuallysetStatus: { status: GameStatus };
  MakeNewGame: { nextGameId: string };
}

export type AnyAction = {
  [K in keyof ActionMap]: Action<K, ActionMap[K]>;
}[keyof ActionMap];

export type Dispatchable = AnyAction | GameThunk<any>;

export function drawRole({
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
export function addPlayer({
  player,
  forceTraveling,
}: {
  player: string;
  forceTraveling?: boolean;
}): GameThunk<boolean> {
  return (dispatch, getGame) => {
    dispatch({
      type: "AddPlayer",
      player,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      traveling: forceTraveling || getGame().gameStatus !== "PlayersJoining",
    });
    return true;
  };
}

export function setPlayerNeighbor({
  player,
  newRightNeighbor,
}: {
  player: string;
  newRightNeighbor: string | null;
}): GameThunk<boolean> {
  return (dispatch, getGame) => {
    if (newRightNeighbor && !getGame().playersToRoles[newRightNeighbor]) {
      throw new Error(`Neighbor ${newRightNeighbor} not found.`);
    }
    if (getGame().gameStatus === "PlayersJoining") {
      dispatch({
        type: "SetNeighbor",
        player,
        newRightNeighbor,
      });
    } else {
      // Probably revisit this to make it the same action?
      if (newRightNeighbor === null) {
        dispatch({
          type: "ExtractPlayerFromCircle",
          player,
        });
      } else {
        dispatch({
          type: "PlacePlayerInCircle",
          player,
          newRightNeighbor,
        });
      }
    }

    return true;
  };
}
