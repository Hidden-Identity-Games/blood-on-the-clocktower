import { type Script } from '../types/index.ts'
import { WatchableResource } from './watchableResource.ts'
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

export function addScript (gameId: string): void {
  if (scriptExists(gameId)) {
    throw new Error(`Script for game ${gameId} already exists"`)
  }
  scriptDB[gameId] = new WatchableResource([] as Script, {})
}

export function subscribeToScript (
  gameId: string,
  callback: (value: Script | null) => void,
): () => void {
  if (!scriptExists(gameId)) {
    throw new Error(`${gameId} not found`)
  }

  return scriptDB[gameId].subscribe(callback)
}
