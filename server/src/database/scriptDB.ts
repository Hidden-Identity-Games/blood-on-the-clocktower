import { type Script } from "@hidden-identity/shared";

import { RemoteStorage, StoreFile } from "./remoteStorage.ts";
import { WatchableResource } from "./watchableResource.ts";
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ComputedScript {}

type WatchableScript = WatchableResource<Script, ComputedScript>;
const scriptDB: Record<string, WatchableScript> = {};
const storage = new StoreFile<Script>("script", new RemoteStorage());

export async function scriptExists(gameId: string): Promise<boolean> {
  if (scriptDB[gameId]) return true;

  const scriptFromStorage = await storage.getFile(gameId);
  if (scriptFromStorage) {
    scriptDB[gameId] = new WatchableResource(scriptFromStorage, {});
    scriptDB[gameId].subscribe((value) => {
      storage.putFile(gameId, value as Script).catch((e) => {
        console.error(e);
      });
    });
    return true;
  }

  return false;
}

export async function retrievescript(gameId: string): Promise<WatchableScript> {
  if (!(await scriptExists(gameId))) {
    throw new Error(`${JSON.stringify(gameId)} not found`);
  }

  return scriptDB[gameId];
}

export async function setScript(
  gameId: string,
  newScript: Script,
): Promise<void> {
  const script = await retrievescript(gameId);
  script.update(newScript);
}

export async function addScript(gameId: string, script: Script): Promise<void> {
  if (await scriptExists(gameId)) {
    throw new Error(`Script for game ${gameId} already exists"`);
  }

  scriptDB[gameId] = new WatchableResource(script, {});
  scriptDB[gameId].subscribe((value) => {
    storage.putFile(gameId, value as Script).catch((e) => {
      console.error(e);
    });
  });
}

export async function addTestScript(
  gameId: string,
  script: Script,
): Promise<void> {
  scriptDB[gameId] = new WatchableResource(script, {});
}

export async function subscribeToScript(
  gameId: string,
  callback: (value: Script | null) => void,
): Promise<() => void> {
  if (!(await scriptExists(gameId))) {
    throw new Error(`${gameId} not found`);
  }

  return scriptDB[gameId].subscribe(callback);
}
