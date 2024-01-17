import { getScript } from "@hidden-identity/shared";
import { beforeEach, describe, expect, it, type MockedFunction } from "vitest";

import { remoteStorage } from "../src/database/PersistentStorage/RemoteStorage.ts";
import { GameCreator } from "../src/testingUtils/gameCreator.ts";
import { apiCaller, createGame } from "./utils.ts";

const remoteMock = remoteStorage as unknown as {
  getFile: MockedFunction<() => unknown>;
  putFile: MockedFunction<() => unknown>;
};

describe("presistent storage", () => {
  beforeEach(() => {});
  it("will persist a new game on creation", async () => {
    const gameId = await createGame();
    const game = await apiCaller.getGame({ gameId });

    expect(remoteMock.putFile).toHaveBeenCalledOnce();
    expect(remoteMock.putFile).toHaveBeenLastCalledWith("game", gameId, game);
  });
  it("will pull a persistent game if not found", async () => {
    const gameId = "test-game";
    const gameFromStorage = new GameCreator(getScript("Catfishing"))
      .addPlayers(10)
      .toGameMachine()
      .getGame();

    remoteMock.getFile.mockResolvedValueOnce(gameFromStorage);

    const game = await apiCaller.getGame({ gameId });
    expect(remoteMock.getFile).toHaveBeenCalledOnce();
    expect(remoteMock.getFile).toHaveBeenCalledWith("game", gameId);
    expect(game).toMatchObject(gameFromStorage);
  });
});
