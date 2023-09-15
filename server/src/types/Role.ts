export type Role = string & {
  __is_char_id: true
}

export interface RoleExtension {
  id: Role
  name: string
  team: string
  firstNight: number
  firstNightReminder: string
  otherNight: number
  otherNightReminder: string
  setup: boolean
  ability: string
}
