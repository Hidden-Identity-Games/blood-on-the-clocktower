import {
  Alignment,
  Character,
  CharacterType,
  Role,
  Script,
} from "@hidden-identity/server";
import scriptsJson from "./scripts.json";
import defaultRoleImage from "../default_role.svg";
import { characters as charactersList } from "./characterData";

const characters: Record<Role, Character> = Object.fromEntries(
  charactersList.map((role) => [
    role.id as Role,
    {
      ...role,
      id: role.id as Role,
      imageSrc: role.imageSrc || defaultRoleImage,
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

export function oppositeAlignment(alignment: Alignment): "Evil" | "Good" {
  return alignment === "Good" ? "Evil" : "Good";
}

export function getDefaultAlignment(role: Role) {
  return defaultAlignments[getCharacter(role).team];
}

const travelers: Role[] = charactersList
  .filter((role) => role.team === "Traveler")
  .map(({ id }) => id as Role);

export function getCharacter(role: Role): Character {
  if (!characters[role]) {
    throw new Error(`Character not found for role${role}`);
  }
  return characters[role];
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
