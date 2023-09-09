export interface UnifiedGame {
  playersToRoles: Record<string, Role>
  partialPlayerOrdering: Record<string, Neighbors>
  orderedPlayers: string[]
  gmSecretHash: string
  gameStarted: boolean
  nextGameId?: string
}

export interface Neighbors {
  leftNeighbor: string
  rightNeighbor: string
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
  id: Role
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
