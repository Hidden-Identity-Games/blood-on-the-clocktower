import { type Role } from './Role.ts'

export interface Reveal {
  character?: Role
  player?: string
}

export interface PlayerMessageScreenMessage {
  message: string
  reveal?: Record<string, Reveal[]>
}
