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
  await page.getByRole("button", { name: /join/i });
  expect(await page.getByText(/Alive players: 10/));
  expect(await page.getByText(/votes to execute: 6/));
});
