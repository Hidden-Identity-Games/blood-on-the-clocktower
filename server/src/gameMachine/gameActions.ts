import {
  type Alignment,
  type GameStatus,
  type PlayerMessage,
  type PlayerStatus,
  type Role,
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
  CreateMessage: PlayerActionProperties & { message: PlayerMessage };
  DeleteMessage: { messageId: string };
  StartDay: NoAdditionalProperties;
  StartNight: NoAdditionalProperties;
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
