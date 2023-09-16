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

export interface Character {
  id: Role
  name: string
  firstNight: number
  firstNightReminder: string
  otherNight: number
  otherNightReminder: string
  setup: boolean
  ability: string
  imageSrc: string
  team: CharacterType
}
