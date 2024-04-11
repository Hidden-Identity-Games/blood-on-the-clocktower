import { expect, test } from "@playwright/test";

import { ClickthroughModel } from "./helpers/clickthroughHelpers";
import { QuickSetupHelpers } from "./helpers/quickHelpers";

test("can spectate a game", async ({ page }) => {
  const players = Array.from({ length: 10 }, (_, i) => `player${i}`);
  const { gameId } = await QuickSetupHelpers.createStartedGame(
    "Bad Moon Rising",
    players,
  );

  await ClickthroughModel.openHomePage(page);
  await page.getByRole("button", { name: /spectate/i }).click();
  await page.getByRole("textbox").fill(gameId);
  await page.getByRole("button", { name: /join/i }).click();
  const alivePlayers = page.getByText(/Alive players/);
  await alivePlayers.waitFor();
  await expect(alivePlayers).toHaveText(/ 10/);
  await expect(page.getByText(/votes to execute:/i)).toHaveText(/ 5/);
});
