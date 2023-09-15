import { type Script } from '../types/index.ts'
import { type WatchableResource } from './watchableResource.ts'
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ComputedScript {}

type WatchableScript = WatchableResource<Script, ComputedScript>
const scriptDB: Record<string, WatchableScript> = {}

export function scriptExists (gameId: string): boolean {
  return !!scriptDB[gameId]
}

export function retrievescript (gameId: string): WatchableScript {
  if (!scriptExists(gameId)) {
    throw new Error(`${JSON.stringify(gameId)} not found`)
  }

  return scriptDB[gameId]
}

export function setScript (gameId: string, newScript: Script): void {
  const script = retrievescript(gameId)
  script.update(newScript)
}
