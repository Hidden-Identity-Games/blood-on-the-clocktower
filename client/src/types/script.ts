import type { Script, Character, CharacterType } from "@hidden-identity/server";

// Can't share actual code with the server right now, only types
export const CharacterTypes = [
  "Townsfolk",
  "Outsider",
  "Minion",
  "Demon",
] satisfies Array<CharacterType>;

export { Script, Character, CharacterType };
