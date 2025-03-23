import { CHARACTERS } from "./characterData.ts";

const nameMap = new Map<string, string>(
  CHARACTERS.map((character) => [character.id.replace(/_/g, ""), character.id]),
);

export function transformName(name: string): string {
  return nameMap.get(name) ?? name;
}
