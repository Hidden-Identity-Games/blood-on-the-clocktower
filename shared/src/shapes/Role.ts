import { z } from "zod";

import { type ReminderType, type TargetType } from "../index.ts";

export const CharacterTypes = [
  "Townsfolk",
  "Outsider",
  "Minion",
  "Demon",
  "Traveler",
] as const;
export const CharacterTypeShape = z.enum(CharacterTypes);

export const alignmentShape = z.enum(["Good", "Evil"]);
export type Alignment = z.TypeOf<typeof alignmentShape>;
export const roleShape = z.string().refine<Role>((_arg): _arg is Role => true);

// TODO: Rename TEAM
export type CharacterType = z.TypeOf<typeof CharacterTypeShape>;

export type Role = string & {
  __is_char_id: true;
};

export interface CharacterNightData {
  order: number;
  reminder: string;
  playerMessage?: PlayerMessageCreator;
  setReminders?: string[];
}

export interface Character {
  id: Role;
  name: string;
  firstNight: CharacterNightData | null;
  otherNight: CharacterNightData | null;
  setup: boolean;
  ability: string;
  reminders: Reminder[];
  imageSrc: string;
  team: CharacterType;
  delusional?: boolean;
}

export interface Reminder {
  name: string;
  type: ReminderType;
  dayTrigger?: boolean;
  duration?: number;
  persistOnDeath?: boolean;
  causedByDeath?: boolean;
  dayReminder?: boolean;
  target?: TargetType;
}

export interface Restriction {
  role?: string[];
  team?: CharacterType[];
  alive?: boolean;
  inPlay?: boolean;
  guess?: boolean;
  alignment?: Alignment;
}

export interface PlayerMessageCreatorMap {
  "demon-first-night": {
    type: "demon-first-night";
  };
  "character-selected-you": {
    type: "character-selected-you";
    restriction?: Restriction;
  };
  "reveal-role": {
    type: "reveal-role";
    count: number;
    restriction?: Restriction;
  };
  "reveal-team": {
    type: "reveal-team";
    restriction?: Restriction;
    count: number;
  };
  "reveal-character": {
    type: "reveal-character";
    restriction?: Restriction;
    count: number;
  };
  "role-change": {
    type: "role-change";
    alignmentChange: boolean;
    restriction?: Restriction;
  };
  "alignment-change": {
    type: "alignment-change";
    restriction?: Pick<Restriction, "alignment">;
  };
  madness: {
    type: "madness";
  };
  revived: {
    type: "revived";
  };
}

export type PlayerMessageCreator =
  PlayerMessageCreatorMap[keyof PlayerMessageCreatorMap];
