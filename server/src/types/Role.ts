export const CharacterTypes = [
  'Townsfolk',
  'Outsider',
  'Minion',
  'Demon',
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

export type Restriction = string

export interface PlayerMessageMap {
  'reveal-role': {
    type: 'reveal-role'
    count: number
    restriction: Restriction
  }
  'demon-first-night': {
    type: 'demon-first-night'
  }
}

export type PlayerMessage = PlayerMessageMap[keyof PlayerMessageMap]
