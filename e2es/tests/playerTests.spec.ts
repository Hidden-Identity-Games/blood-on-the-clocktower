import { test, expect } from "@playwright/test";
import { createNewGame, playerJoinGame } from "./utils";

test("can join game", async ({ page }) => {
  const gameId = await createNewGame(page);
  await playerJoinGame(page, gameId, "Test");
  await expect(page.url()).toContain(gameId);
});
