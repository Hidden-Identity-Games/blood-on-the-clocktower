import {
  Character,
  CharacterNightData,
  CharacterType,
  Role,
  Script,
} from "@hidden-identity/server";
import scriptsJson from "./scripts.json";
import defaultRoleImage from "../default_role.svg";
import rolesCombinedJSON from "./rolesCombined.json";

const characters: Record<Role, Character> = Object.fromEntries(
  rolesCombinedJSON.map((role) => [
    role.id as Role,
    {
      ...role,
      id: role.id as Role,
      team: role.team as CharacterType,
      firstNight: role.firstNight as CharacterNightData | null,
      otherNight: role.otherNight as CharacterNightData | null,
    },
  ]),
);

export function getCharacter(role: Role): Character {
  return (
    characters[role] ??
    ({
      id: role,
      name: role,
      team: "Unknown",
      firstNight: null,
      otherNight: null,
      setup: true,
      ability: "Custom character",
      imageSrc: defaultRoleImage,
    } satisfies Character)
  );
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
