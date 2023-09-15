import { Character, Role, Script } from "@hidden-identity/server";
import rolesJson from "./roles.json";
import scriptsJson from "./scripts.json";
import defaultRoleImage from "../default_role.svg";
import roleExtensionsJSON from "./role-info.json";

interface RoleExtension {
  id: string;
  name: string;
  team: string;
  firstNight: number;
  firstNightReminder: string;
  otherNight: number;
  otherNightReminder: string;
  setup: boolean;
  ability: string;
}

export const roles: Record<string, Character> = Object.fromEntries(
  rolesJson.characters.map((role) => [role.id, role as Character]),
);
export const roleExtensions: Record<Role, RoleExtension> = Object.fromEntries(
  roleExtensionsJSON.map((role) => [
    role.name.toLocaleLowerCase().replace(" ", "_"),
    role as RoleExtension,
  ]),
);

export function getRoleExtension(role: Role): RoleExtension {
  return (
    roleExtensions[role] ??
    ({
      id: role,
      name: role,
      team: "Unknown",
      firstNight: -1,
      firstNightReminder: "Custom Character",
      otherNight: -1,
      otherNightReminder: "Custom Character",
      setup: true,
      ability: "Custom character",
    } satisfies RoleExtension)
  );
}

export function getRole(role: Role): Character {
  return (
    roles[role] ??
    ({
      id: role,
      name: role,
      imageSrc: defaultRoleImage,
      team: "Unknown",
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
