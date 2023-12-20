import { z } from "zod";
import { type Alignment, type Role } from "./Role.ts";
import { PlayerMessage } from "./PlayerMessages.ts";

export const gameStatusShape = z.enum([
  "PlayersJoining",
  "Setup",
  "Started",
  "Finished",
]);
export type GameStatus = z.TypeOf<typeof gameStatusShape>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlayerStatusType = PlayerStatus extends any
  ? Omit<PlayerStatus, "id">
  : never;
export type PlayerStatus = PlayerStatusMap[keyof PlayerStatusMap];

export const poisonStatusShape = z.object({
  type: z.enum(["poison"]),
  id: z.string(),
});
export const drunkStatusShape = z.object({
  type: z.enum(["drunk"]),
  id: z.string(),
});
export const protectedStatusShape = z.object({
  type: z.enum(["protected"]),
  id: z.string(),
});
export const characterAbilityStatusShape = z.object({
  type: z.enum(["characterAbility"]),
  id: z.string(),
});
export const deadStatusShape = z.object({
  type: z.enum(["dead"]),
  id: z.string(),
});
const allStatusShapes = {
  poison: poisonStatusShape,
  drunk: drunkStatusShape,
  protected: protectedStatusShape,
  characterAbility: characterAbilityStatusShape,
  dead: deadStatusShape,
};

export type PlayerStatusMap = {
  [K in keyof typeof allStatusShapes]: z.TypeOf<(typeof allStatusShapes)[K]>;
};

export interface UnifiedGame extends BaseUnifiedGame, UnifiedGameComputed {}

export interface UnifiedGameComputed {
  orderedPlayers: WellOrderedPlayers | BrokenOrderedPlayers;
  playerList: string[];
  rolesToPlayers: Record<Role, string[]>;
}

export interface BaseUnifiedGame {
  playersToRoles: Record<string, Role>;
  partialPlayerOrdering: Record<string, Neighbors | null>;
  gmSecretHash: string;
  gameStatus: GameStatus;
  nextGameId?: string;
  deadPlayers: Record<string, boolean>;
  playerPlayerStatuses: Record<string, PlayerStatus[]>;
  playerNotes: Record<string, string>;
  deadVotes: Record<string, boolean>;
  onTheBlock: Record<string, number>;
  travelers: Record<string, boolean>;
  alignmentsOverrides: Record<string, Alignment>;
  roleBag: Record<number, Role | null>;
  playersSeenRoles: string[];
  messages: PlayerMessage[];
}

export interface WellOrderedPlayers {
  problems: false;
  fullList: string[];
}

export type ProblemType = Problem["type"];
export type Problem =
  | {
      type: "spiderman";
    }
  | { type: "broken-link" }
  | { type: "excluded" }
  | { type: "excluder" };

export interface BrokenOrderedPlayers {
  problems: true;
  playerProblems: Record<string, Problem | null>;
}

export interface Neighbors {
  rightNeighbor: string | null;
}
