import { Alignment, Character, CharacterType, Role } from "../shapes/Role.ts";
import { Script } from "../shapes/Script.ts";
import { SCRIPTS, ScriptDefinition, ScriptName } from "./scripts.ts";
import { CHARACTERS as charactersList } from "./characterData.ts";

const characters = Object.fromEntries(
  charactersList.map((character) => [character.id, character]),
) as unknown as Record<Role, Character>;

export const defaultAlignments: Record<CharacterType, Alignment> = {
  Demon: "Evil",
  Minion: "Evil",
  Outsider: "Good",
  Townsfolk: "Good",
  Traveler: "Good",
};

export const DistributionsByPlayerCount: Record<
  number,
  Record<CharacterType, number>
> = {
  5: { Townsfolk: 3, Outsider: 0, Minion: 1, Demon: 1, Traveler: 0 },
  6: { Townsfolk: 3, Outsider: 1, Minion: 1, Demon: 1, Traveler: 0 },
  7: { Townsfolk: 5, Outsider: 0, Minion: 1, Demon: 1, Traveler: 0 },
  8: { Townsfolk: 5, Outsider: 1, Minion: 1, Demon: 1, Traveler: 0 },
  9: { Townsfolk: 5, Outsider: 2, Minion: 1, Demon: 1, Traveler: 0 },
  10: { Townsfolk: 7, Outsider: 0, Minion: 2, Demon: 1, Traveler: 0 },
  11: { Townsfolk: 7, Outsider: 1, Minion: 2, Demon: 1, Traveler: 0 },
  12: { Townsfolk: 7, Outsider: 2, Minion: 2, Demon: 1, Traveler: 0 },
  13: { Townsfolk: 9, Outsider: 0, Minion: 3, Demon: 1, Traveler: 0 },
  14: { Townsfolk: 9, Outsider: 1, Minion: 3, Demon: 1, Traveler: 0 },
  15: { Townsfolk: 9, Outsider: 2, Minion: 3, Demon: 1, Traveler: 0 },
};

export function oppositeAlignment(alignment: Alignment): "Evil" | "Good" {
  return alignment === "Good" ? "Evil" : "Good";
}

export function getDefaultAlignment(role: Role) {
  return defaultAlignments[getCharacter(role).team];
}

export function getCharacter(role: Role): Character {
  return characters[role ?? "unassigned"];
}

const scripts: Record<ScriptName, Script> = Object.fromEntries(
  SCRIPTS.map(({ name, characters }) => [name, characters as Script] as const),
) as Record<ScriptName, Script>;

const scriptDefinitions: Record<string, ScriptDefinition> = Object.fromEntries(
  SCRIPTS.map(
    (scriptDefinition) => [scriptDefinition.name, scriptDefinition] as const,
  ),
);

export function getScript(scriptID: ScriptName): Script {
  return scripts[scriptID];
}

export function getScriptImg(scriptID: ScriptName): string | undefined {
  return scriptDefinitions[scriptID]?.imageSrc || undefined;
}

export function getScriptNames(): ScriptName[] {
  return Object.keys(scripts) as ScriptName[];
}

const travelers: Role[] = charactersList
  .filter((role) => role.team === "Traveler")
  .map(({ id }) => id as Role);

export function allTravelers() {
  return travelers;
}

export function validCharactersList() {
  return charactersList.filter((c) => !c.delusional);
}
export function allCharactersList() {
  return charactersList;
}
