import { test, expect } from "@playwright/test";
import { assignSeats, createNewGame, populateGameWithPlayers } from "./utils";
import { urlFromBase } from "./productUrls";

test("can spectate a game", async ({ page, context }) => {
  const gameId = await createNewGame(page, "Sects & Violets");
  const playerPages = await populateGameWithPlayers(
    context,
    Array.from({ length: 10 }, (_, i) => `player${i}`),
    gameId,
  );
  await assignSeats(playerPages);

  page.goto(urlFromBase("", {}));
  await page.getByRole("button", { name: /spectate/i }).click();
  await page.getByRole("textbox").fill(gameId);
  await page.getByRole("button", { name: /join/i }).click();
  const alivePlayers = page.getByText(/Alive players/);
  await alivePlayers.waitFor();
  await expect(alivePlayers).toHaveText(/ 10/);
  await expect(page.getByText(/votes to execute:/i)).toHaveText(/ 5/);
});
