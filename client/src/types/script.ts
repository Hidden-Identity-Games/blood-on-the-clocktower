import type {
  Alignment,
  Character,
  CharacterType,
  Script,
  ScriptItem,
} from "@hidden-identity/shared";

// Can't share actual code with the server right now, only types
export const CharacterTypes = [
  "Townsfolk",
  "Outsider",
  "Minion",
  "Demon",
  "Traveler",
] satisfies Array<CharacterType>;

export const ALIGNMENTS: readonly Alignment[] = ["Good", "Evil"] as const;

export { Character, CharacterType, Script, ScriptItem };
