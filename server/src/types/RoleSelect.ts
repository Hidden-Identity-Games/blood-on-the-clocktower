import { type Role } from './Role.ts'

export interface RoleSelection {
  roleBag: Record<Role, boolean>
  // playersAcknowledgedRole: string[]
}
