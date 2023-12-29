import { getCharacter, type Role, type UnifiedGame } from "../index.ts";

export function asRole(role: string): Role {
  return role as Role;
}

export function getAbility(role: Role | undefined, time: UnifiedGame["time"]) {
  if (!role) {
    return null;
  }
  const isFirstNight = time.time === "night" && time.count === 1;
  const abilityKey = isFirstNight ? "firstNight" : "otherNight";
  return getCharacter(role)[abilityKey];
}
