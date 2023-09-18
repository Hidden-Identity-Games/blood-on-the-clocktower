import type {
  Script,
  Character,
  ScriptItem,
  CharacterType,
  Alignment,
} from "@hidden-identity/server";

// Can't share actual code with the server right now, only types
export const CharacterTypes = [
  "Townsfolk",
  "Outsider",
  "Minion",
  "Demon",
  "Traveler",
] satisfies Array<CharacterType>;

export const ALIGNMENTS: readonly Alignment[] = ["Good", "Evil"] as const;

export { Script, Character, ScriptItem, CharacterType };
