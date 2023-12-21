import { type Role } from "../index.ts";

export function asRole(role: string): Role {
  return role as Role;
}
