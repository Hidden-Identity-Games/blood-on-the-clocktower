export interface Script {
  name: string;
  imageSrc: string;
  characters: Character[];
}
export interface UnifiedGame {
  playersToNames: Record<string, string>;
  playersToRoles: PlayerSet;
  gmSecretHash: string;
  gameStarted: boolean;
}

export type PlayerSet = Record<string, string>;

export interface Self {
  name: string | undefined;
  role: string | undefined;
}

export interface Character {
  id: string;
  name: string;
  team: string;
  imageSrc?: string;
}

export interface CharacterId {
  id: string;
}

export const CharacterTypes = [
  "Townsfolk",
  "Outsider",
  "Minion",
  "Demon",
] as const;

export type CharacterType = (typeof CharacterTypes)[number];
