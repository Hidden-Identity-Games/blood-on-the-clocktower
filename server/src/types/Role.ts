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
