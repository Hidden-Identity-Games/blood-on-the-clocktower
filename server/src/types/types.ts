export interface UnifiedGame {
  playersToNames: Record<string, string>
  playersToRoles: PlayerSet
  playerOrder: Record<string, Neighbors>
  gmSecretHash: string
  gameStarted: boolean
}

export type PlayerSet = Record<string, string>

export interface Neighbors {
  leftNeighbor: string
  rightNeighbor: string
}

export interface Self {
  name: string | undefined
  role: string | undefined
}

export type Role = string & {
  __is_char_id: true
}

export interface Character {
  id: Role
  name: string
  team: CharacterType
  imageSrc?: string
}

export interface ScriptItem {
  id: string
}
export type Script = ScriptItem[]

export const CharacterTypes = [
  'Townsfolk',
  'Outsider',
  'Minion',
  'Demon',
] as const

export type CharacterType = (typeof CharacterTypes)[number] | 'Unknown'
export type KnownCharacterType = (typeof CharacterTypes)[number]
