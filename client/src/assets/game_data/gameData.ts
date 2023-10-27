import {
  Alignment,
  Character,
  CharacterType,
  KnownCharacterType,
  Role,
  Script,
} from "@hidden-identity/server";
import scriptsJson from "./scripts.json";
import { characters as charactersList } from "./characterData";

const characters: Record<Role, Character> = Object.fromEntries(
  charactersList.map((role) => [
    role.id as Role,
    {
      ...role,
      id: role.id as Role,
      imageSrc: new URL(`../icon/role/${role.imageSrc}`, import.meta.url).href,
    },
  ]),
);

export const defaultAlignments: Record<CharacterType, Alignment> = {
  Demon: "Evil",
  Minion: "Evil",
  Outsider: "Good",
  Townsfolk: "Good",
  Traveler: "Good",
};

export const DistributionsByPlayerCount: Record<
  number,
  Record<KnownCharacterType, number>
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
  return defaultAlignments[getCharacter(role)?.team];
}

const travelers: Role[] = charactersList
  .filter((role) => role.team === "Traveler")
  .map(({ id }) => id as Role);

export function getCharacter(role: Role): Character {
  return characters[role ?? "unassigned"];
}

const scripts: Record<string, Script> = Object.fromEntries(
  scriptsJson.scripts.map(
    ({ name, characters }) => [name, characters as Script] as const,
  ),
);
const scriptDescriptions: Record<string, { imageSrc: string }> =
  Object.fromEntries(
    scriptsJson.scripts.map(
      ({ name, imageSrc }) => [name, { imageSrc }] as const,
    ),
  );

export function getScript(scriptID: string): Script | undefined {
  return scripts[scriptID];
}

export function getScriptImg(scriptID: string): string | undefined {
  return scriptDescriptions[scriptID]?.imageSrc || undefined;
}

export function getScriptNames() {
  return Object.keys(scripts);
}

export function allTravelers() {
  return travelers;
}
