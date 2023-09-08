import { Character, Role, Script } from "@hidden-identity/server";
import rolesJson from "./roles.json";
import scriptsJson from "./scripts.json";

export const roles: Record<string, Character> = Object.fromEntries(
  rolesJson.characters.map((role) => [role.id, role as Character]),
);

export function getRole(role: Role): Character {
  return (
    roles[role] ?? {
      id: role,
      name: role,
      imageSrc: "",
    }
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
