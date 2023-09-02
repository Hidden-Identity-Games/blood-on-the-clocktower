export interface UnifiedGame {
  players: Record<string, string>;
  playersToRoles: PlayerSet;
  gmSecretHash: string;
}

export interface PlayerSet {
  [s: string]: string;
}

export interface Self {
  name: string | undefined;
  role: string | undefined;
}
