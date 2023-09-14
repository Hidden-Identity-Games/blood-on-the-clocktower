export interface UnifiedGame extends BaseUnifiedGame {
  orderedPlayers: WellOrderedPlayers | BrokenOrderedPlayers

}
export type GameStatus = 'PlayersJoining' | 'Setup' | 'Started' | 'Finished'
export type NoteType = { type: 'poison' } | { type: 'drunk' } | { type: 'custom', message: string } | { type: 'bluffing', as: string }
export type Note = NoteType & { id: string }
export interface BaseUnifiedGame {
  playersToRoles: Record<string, Role>
  partialPlayerOrdering: Record<string, Neighbors | null>
  gmSecretHash: string
  gameStatus: GameStatus
  nextGameId?: string
  deadPlayers: Record<string, boolean>
  playerNotes: Record<string, Note[]>
  deadVotes: Record<string, boolean>
}

export interface WellOrderedPlayers {
  problems: false
  fullList: string[]
}

export type ProblemType = Problem['type']
export type Problem = {
  type: 'spiderman'
} | { type: 'broken-link' } | { type: 'excluded' } | { type: 'excluder' }

export interface BrokenOrderedPlayers {
  problems: true
  playerProblems: Record<string, Problem | null>
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
