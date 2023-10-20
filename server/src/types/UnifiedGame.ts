import { z } from 'zod'
import { type Alignment, type Role } from './Role.ts'

export const gameStatusShape = z.enum(['PlayersJoining', 'Setup', 'Started', 'Finished'])
export type GameStatus = z.TypeOf<typeof gameStatusShape>

export type PlayerStatusType = PlayerStatus extends any ? Omit<PlayerStatus, 'id'> : never
export type PlayerStatus = PlayerStatusMap[keyof PlayerStatusMap]

export const poisonStatusShape = z.object({ type: z.enum(['poison']), id: z.string() })
export const drunkStatusShape = z.object({ type: z.enum(['drunk']), id: z.string() })
export const customStatusShape = z.object({ type: z.enum(['custom']), desc: z.string(), id: z.string() })
const allStatusShapes =
{
  poison: poisonStatusShape,
  drunk: drunkStatusShape,
  custom: customStatusShape,
}

export type PlayerStatusMap = { [K in keyof typeof allStatusShapes]: z.TypeOf<typeof allStatusShapes[K]> }

export interface UnifiedGame extends BaseUnifiedGame, UnifiedGameComputed {
}

export interface UnifiedGameComputed {
  orderedPlayers: WellOrderedPlayers | BrokenOrderedPlayers
  playerList: string[]
  rolesToPlayers: Record<Role, string[]>
}

export interface BaseUnifiedGame {
  playersToRoles: Record<string, Role>
  partialPlayerOrdering: Record<string, Neighbors | null>
  gmSecretHash: string
  gameStatus: GameStatus
  nextGameId?: string
  deadPlayers: Record<string, boolean>
  playerPlayerStatuses: Record<string, PlayerStatus[]>
  playerNotes: Record<string, string>
  deadVotes: Record<string, boolean>
  travelers: Record<string, boolean>
  alignmentsOverrides: Record<string, Alignment>
  roleBag: Record<Role, number>
  playersSeenRoles: string[]
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
