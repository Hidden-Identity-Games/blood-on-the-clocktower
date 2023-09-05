import rolesJson from "./roles.json";

export const roles = Object.fromEntries(
  rolesJson.characters.map((role) => [role.id, role]),
);
