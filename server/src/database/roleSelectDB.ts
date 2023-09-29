import { type RoleSelection } from '../types/index.ts'
import { type WatchableResource } from './watchableResource.ts'
import { type Role } from '../types/Role.ts'
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ComputedRoleSelection {}

type WatchableRoleSelect = WatchableResource<RoleSelection, ComputedRoleSelection>
const roleSelectDB: Record<string, WatchableRoleSelect> = {}

export function retrieveRoleSelect (gameId: string): WatchableRoleSelect {
  if (!roleSelectExists(gameId)) {
    throw new Error(`${JSON.stringify(gameId)} not found`)
  }

  return roleSelectDB[gameId]
}

export function setRoleTaken (gameId: string, role: Role): boolean {
  const roleSelect = retrieveRoleSelect(gameId)
  const roleSelectInstance = roleSelect.readOnce()

  if (roleSelectInstance.roleBag[role]) return false

  roleSelect.update({
    ...roleSelectInstance,
    roleBag: { ...roleSelectInstance.roleBag, [role]: true },
  })

  return true
}

export async function subscribeToRoleSelect (
  gameId: string,
  callback: (value: RoleSelection | null) => void,
): Promise<() => void> {
  if (!roleSelectExists(gameId)) {
    throw new Error(`${gameId} not found`)
  }

  return roleSelectDB[gameId].subscribe(callback)
}

function roleSelectExists (gameId: string): boolean {
  if (roleSelectDB[gameId]) return true
  return false
}
