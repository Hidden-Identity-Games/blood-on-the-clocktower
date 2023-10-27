import { z } from 'zod'
import { type PlayerStatusType } from './UnifiedGame.ts'

export const CharacterTypes = [
  'Townsfolk',
  'Outsider',
  'Minion',
  'Demon',
  'Traveler',
] as const

export const alignmentShape = z.enum(['Good', 'Evil'])
export type Alignment = z.TypeOf<typeof alignmentShape>

// TODO: Rename TEAM
export type CharacterType = (typeof CharacterTypes)[number]
export type KnownCharacterType = (typeof CharacterTypes)[number]

export type Role = string & {
  __is_char_id: true
}

export interface CharacterNightData {
  order: number
  reminder: string
  playerMessage?: PlayerMessage
  status?: PlayerStatusType[]
}

export interface Character {
  id: Role
  name: string
  firstNight: CharacterNightData | null
  otherNight: CharacterNightData | null
  setup: boolean
  ability: string
  imageSrc: string
  team: CharacterType
}

export interface Restriction {
  role?: string[]
  team?: CharacterType[]
  alive?: boolean
  inPlay?: boolean
  guess?: boolean
  alignment?: Alignment
}

export interface PlayerMessageMap {
  'demon-first-night': {
    type: 'demon-first-night'
  }
  'character-selected-you': {
    type: 'character-selected-you'
    restriction?: Restriction
  }
  'reveal-role': {
    type: 'reveal-role'
    count: number
    restriction?: Restriction
  }
  'reveal-team': {
    type: 'reveal-team'
    restriction?: Restriction
    count: number
  }
  'reveal-player': {
    type: 'reveal-player'
    restriction?: Restriction
    count: number
  }
  'role-change': {
    type: 'role-change'
    alignmentChange: boolean
    restriction?: Restriction
  }
  'alignment-change': {
    type: 'alignment-change'
    restriction?: Pick<Restriction, 'alignment'>
  }
  'madness': {
    type: 'madness'
  }
  'revived': {
    type: 'revived'
  }
}

export type PlayerMessage = PlayerMessageMap[keyof PlayerMessageMap]
