import {
  type UnifiedGame,
  type BaseUnifiedGame,
  type GameStatus,
  type Role,
  type Script,
} from "@hidden-identity/shared";
import { addScript, addTestScript } from "../scriptDB.ts";
import { RemoteStorage, StoreFile } from "../remoteStorage.ts";
import { GameMachine } from "../../gameMachine/gameMachine.ts";
import { type GameCreator } from "../../testingUtils/gameCreator.ts";

export const UNASSIGNED: Role = "unassigned" as Role;

const gameDB: Record<string, GameMachine> = {};
const storage = new StoreFile<BaseUnifiedGame>("game", new RemoteStorage());

export function gameInProgress(game: UnifiedGame): boolean {
  return game.gameStatus === "Started" || game.gameStatus === "Setup";
}

export async function gameExists(gameId: string): Promise<boolean> {
  if (gameDB[gameId]) return true;

  const gameFromStorage = await storage.getFile(gameId);
  if (gameFromStorage) {
    gameDB[gameId] = new GameMachine(gameFromStorage);
    gameDB[gameId].subscribe((value) => {
      storage.putFile(gameId, value as BaseUnifiedGame).catch((e) => {
        console.error(e);
      });
    });
    return true;
  }

  return false;
}

export async function retrieveGame(gameId: string): Promise<GameMachine> {
  if (!(await gameExists(gameId))) {
    throw new Error(`${JSON.stringify(gameId)} not found`);
  }

  return gameDB[gameId];
}

export async function getGame(gameId: string): Promise<UnifiedGame> {
  return (await retrieveGame(gameId)).getGame();
}

export async function addGame(
  gameId: string,
  game: BaseUnifiedGame,
  script: Script,
): Promise<void> {
  console.log(`adding ${gameId}`);
  if (await gameExists(gameId)) {
    throw new Error("Game already exists");
  }

  gameDB[gameId] = new GameMachine(game);
  await addScript(gameId, script);

  gameDB[gameId].subscribe((value) => {
    storage.putFile(gameId, value as BaseUnifiedGame).catch((e) => {
      console.error(e);
    });
  });
}

export async function addTestGame(
  gameId: string,
  gameCreator: GameCreator,
): Promise<void> {
  gameDB[gameId] = gameCreator.toGameMachine();
  await addTestScript(gameId.toUpperCase(), gameCreator.script);
}

export async function subscribeToGame(
  gameId: string,
  callback: (value: UnifiedGame | null) => void,
): Promise<() => void> {
  if (!(await gameExists(gameId))) {
    throw new Error(`${gameId} not found`);
  }

  return gameDB[gameId].subscribe(callback);
}

export async function updateStatus(
  gameId: string,
  status: GameStatus,
): Promise<void> {
  const game = await retrieveGame(gameId);
  game.dispatch({ type: "ManuallysetStatus", status });
}
