import { Role } from "@hidden-identity/server";

export interface Self {
  name: string | undefined;
  role: Role | undefined;
}

export type { UnifiedGame, PlayerSet } from "@hidden-identity/server";
