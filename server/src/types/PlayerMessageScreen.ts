import { type Role } from './Role.ts'

export interface Reveal {
  character?: Role
  player?: string
}

export interface PlayerMessageScreenMessage {
  player?: string
  message: string
  reveal?: Record<string, Reveal[]>
}
