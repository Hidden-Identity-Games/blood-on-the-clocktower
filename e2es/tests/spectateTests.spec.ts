import { test, expect } from "@playwright/test";
import { assignRoles, createNewGame, populateGameWithPlayers } from "./utils";
import { urlFromBase } from "./productUrls";

test("can spectate a game", async ({ page, context }) => {
  const gameId = await createNewGame(page, "Sects & Violets");
  const playerPages = await populateGameWithPlayers(
    context,
    Array.from({ length: 10 }, (_, i) => `player${i}`),
    gameId,
  );
  await assignRoles(playerPages);

  page.goto(urlFromBase("", {}));
  await page.getByRole("button", { name: /spectate/i }).click();
  await page.getByRole("textbox").fill(gameId);
  await page.getByRole("button", { name: /join/i }).click();
  await page.getByText(/Alive players:/i).waitFor();
  expect(await page.getByText(/Alive players:/i)).toHaveText(/ 10/);
  expect(await page.getByText(/votes to execute:/i)).toHaveText(/ 5/);
});
