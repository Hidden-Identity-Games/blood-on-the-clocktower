export const CharacterTypes = [
  'Townsfolk',
  'Outsider',
  'Minion',
  'Demon',
  'Traveler',
] as const

export type CharacterType = (typeof CharacterTypes)[number] | 'Unknown'
export type KnownCharacterType = (typeof CharacterTypes)[number]

export type Role = string & {
  __is_char_id: true
}

export interface CharacterNightData {
  order: number
  reminder: string
  playerMessage?: PlayerMessage
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
  role?: string
  team?: CharacterType | 'Good' | 'Evil'
  alive?: boolean
  inPlay?: boolean
  guess?: boolean
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
    teamChange: boolean
    restriction?: Restriction
  }
  'team-change': {
    type: 'team-change'
    restriction?: Restriction
  }
  'madness': {
    type: 'madness'
  }
  'revived': {
    type: 'revived'
  }
}

export type PlayerMessage = PlayerMessageMap[keyof PlayerMessageMap]
