export interface UnifiedGame {
  playersToRoles: Record<string, Role>
  partialPlayerOrdering: Record<string, Neighbors | null>
  orderedPlayers: WellOrderedPlayers | BrokenOrderedPlayers
  gmSecretHash: string
  gameStarted: boolean
  nextGameId?: string
}

export interface WellOrderedPlayers {
  fullList: string[]
}

export interface BrokenOrderedPlayers {
  brokenLinks: string[]
  spidermanPointing: Array<[string, string]>
  excludedPlayers: Record<string, string[]>
}

export interface Neighbors {
  rightNeighbor: string | null
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
