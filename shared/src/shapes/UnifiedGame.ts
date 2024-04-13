import { z } from "zod";

import {
  type PlayerMessage,
  type PlayerMessageEntry,
} from "./PlayerMessages.ts";
import { type AppliedPlayerReminder } from "./PlayerReminder.ts";
import { type Alignment, type Role } from "./Role.ts";

export const gameStatusShape = z.enum([
  "PlayersJoining",
  "Setup",
  "Started",
  "Finished",
]);
export type GameStatus = z.TypeOf<typeof gameStatusShape>;
export const dayNightShape = z.enum(["day", "night"]);
export const timeRecordShape = z.object({
  time: dayNightShape,
  count: z.number(),
  startTime: z.number().nullable(),
});
export type TimeRecord = z.TypeOf<typeof timeRecordShape>;

export type CalculatedPlayerMessage = Omit<PlayerMessage, "messages"> & {
  messages: Record<string, PlayerMessageEntry[]>;
};

export interface UnifiedGame extends BaseUnifiedGame, UnifiedGameComputed {}

export interface UnifiedGameComputed {
  orderedPlayers: WellOrderedPlayers | BrokenOrderedPlayers;
  playerList: string[];
  rolesToPlayers: Partial<Record<Role, string[]>>;
  messagesByNight: Record<number, CalculatedPlayerMessage[]>;
}

export interface BaseUnifiedGame {
  setupRoleSet: Record<Role, number>;
  estimatedPlayerCount: number | null;
  playersToRoles: Record<string, Role>;
  partialPlayerOrdering: Record<string, Neighbors | null>;
  gmSecretHash: string;
  gameStatus: GameStatus;
  nextGameId?: string;
  deadPlayers: Record<string, boolean>;
  playerNotes: Record<string, string>;
  deadVotes: Record<string, boolean>;
  onTheBlock: Record<string, number>;
  travelers: Record<string, boolean>;
  alignmentsOverrides: Record<string, Alignment>;
  roleBag: Record<number, Role | null>;
  playersSeenRoles: string[];
  messages: PlayerMessage[];
  reminders: AppliedPlayerReminder[];
  time: TimeRecord;
  actionQueue: ActionQueueItem[];
  script: Script;
}

export interface ScriptItem {
  id: Role;
}
export type Script = ScriptItem[];

export interface WellOrderedPlayers {
  problems: false;
  playerProblems?: Record<string, Problem | null>;
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
  fullList: string[];
}

export interface Neighbors {
  rightNeighbor: string | null;
}

export interface BaseActionQueueItem {
  id: string;
  player?: string;
  order: number;
  status: "skip" | "done" | "notInGame" | "todo";
}

export interface SpecialActionQueueItem extends BaseActionQueueItem {
  type: "game";
  actionType: "DEMON" | "MINIONS" | "EXECUTION";
}
export interface CharacterActionQueueItem extends BaseActionQueueItem {
  type: "character";
  player?: string;
  role: Role;
}

export type ActionQueueItem = CharacterActionQueueItem | SpecialActionQueueItem;
