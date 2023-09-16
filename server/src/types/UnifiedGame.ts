import { type Role } from './Role.ts'

export type GameStatus = 'PlayersJoining' | 'Setup' | 'Started' | 'Finished'
export type PlayerStatusType = { type: 'poison' } | { type: 'drunk' } | { type: 'custom', desc: string }
export type PlayerStatus = PlayerStatusType & { id: string }
export interface PlayerNote { id: string, message: string }

export interface UnifiedGame extends BaseUnifiedGame, UnifiedGameComputed {
}

export interface UnifiedGameComputed {
  orderedPlayers: WellOrderedPlayers | BrokenOrderedPlayers
  playerList: string[]
}

export interface BaseUnifiedGame {
  playersToRoles: Record<string, Role>
  partialPlayerOrdering: Record<string, Neighbors | null>
  gmSecretHash: string
  gameStatus: GameStatus
  nextGameId?: string
  deadPlayers: Record<string, boolean>
  playerPlayerStatuses: Record<string, PlayerStatus[]>
  playerNotes: Record<string, PlayerNote[]>
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
