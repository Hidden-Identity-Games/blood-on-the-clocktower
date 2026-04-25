import { getScript, type Role } from "@hidden-identity/shared";
import { expect, test } from "@playwright/test";

import { QuickSetupHelpers } from "./helpers/quickHelpers";
import { urlFromBase } from "./productUrls";

test("displays Fabled/Loric section on GM script page", async ({ page }) => {
  // Create a Trouble Brewing script with fabled + loric characters added
  const baseScript = getScript("Trouble Brewing");
  const scriptWithFabled = [
    ...baseScript,
    { id: "djinn" as Role },
    { id: "tor" as Role },
  ];

  const { gameId, game } =
    await QuickSetupHelpers.createNewGame(scriptWithFabled);

  await page.goto(
    urlFromBase("gm", { gameId, gmSecretHash: game.gmSecretHash }),
  );

  // Navigate to the script view
  await page.getByRole("tab", { name: /script/i }).click();

  // Verify the Fabled/Loric section appears
  await expect(page.getByText("Fabled/Loric")).toBeVisible();
  await expect(page.getByText("Djinn")).toBeVisible();
  await expect(page.getByText("Tor")).toBeVisible();
});
