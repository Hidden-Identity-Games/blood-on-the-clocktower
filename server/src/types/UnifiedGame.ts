import { type Role } from './Role.ts'
import { type Script } from './Script.ts'

export type GameStatus = 'PlayersJoining' | 'Setup' | 'Started' | 'Finished'
export type NoteType = { type: 'poison' } | { type: 'drunk' } | { type: 'custom', message: string } | { type: 'bluffing', as: string }
export type Note = NoteType & { id: string }

export interface UnifiedGame extends BaseUnifiedGame, UnifiedGameComputed {
}

export interface UnifiedGameComputed {
  orderedPlayers: WellOrderedPlayers | BrokenOrderedPlayers

}

export interface BaseUnifiedGame {
  script?: Script
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

export interface Character {
  id: Role
  name: string
  team: CharacterType
  imageSrc?: string
}

export const CharacterTypes = [
  'Townsfolk',
  'Outsider',
  'Minion',
  'Demon',
] as const

export type CharacterType = (typeof CharacterTypes)[number] | 'Unknown'
export type KnownCharacterType = (typeof CharacterTypes)[number]
