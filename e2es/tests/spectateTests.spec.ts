import { test, expect } from "@playwright/test";
import { QuickSetupHelpers } from "./helpers/quickHelpers";
import { urlFromBase } from "./productUrls";

test("can spectate a game", async ({ page }) => {
  const { gameId } = await QuickSetupHelpers.createStartedGame(
    "Bad Moon Rising",
    10,
  );

  page.goto(urlFromBase("", {}));
  await page.getByRole("button", { name: /spectate/i }).click();
  await page.getByRole("textbox").fill(gameId);
  await page.getByRole("button", { name: /join/i }).click();
  const alivePlayers = page.getByText(/Alive players/);
  await alivePlayers.waitFor();
  await expect(alivePlayers).toHaveText(/ 10/);
  await expect(page.getByText(/votes to execute:/i)).toHaveText(/ 5/);
});
