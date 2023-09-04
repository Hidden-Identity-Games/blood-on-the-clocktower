export interface Script {
  name: string
  characters: Character[]
}
export interface UnifiedGame {
  playersToNames: Record<string, string>
  playersToRoles: PlayerSet
  gmSecretHash: string
  gameStarted: boolean
}

export type PlayerSet = Record<string, string>

export interface Self {
  name: string | undefined
  role: string | undefined
}

export interface Character {
  name: string
  team: string
  imageSrc: string
}

export const CharacterTypes = [
  'Townsfolk',
  'Outsider',
  'Minion',
  'Demon',
] as const

export type CharacterType = (typeof CharacterTypes)[number]
