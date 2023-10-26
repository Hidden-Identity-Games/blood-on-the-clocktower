import { type CharacterType, type Role } from './Role.ts'

export interface Reveal {
  character?: Role
  player?: string
  team?: CharacterType
  alignment?: 'Good' | 'Evil'
}

export interface PlayerMessageScreenMessage {
  message: string
  reveal: Record<string, Reveal[]>
}
