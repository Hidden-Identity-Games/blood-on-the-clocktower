import { Character } from "@hidden-identity/server";
import rolesJson from "./roles.json";

export const roles: Record<string, Character> = Object.fromEntries(
  rolesJson.characters.map((role) => [role.id, role as Character]),
);
