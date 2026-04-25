import { getScript, type Role } from "@hidden-identity/shared";
import { expect, test } from "@playwright/test";

import { QuickSetupHelpers } from "./helpers/quickHelpers";
import { urlFromBase } from "./productUrls";

test("displays Fabled/Loric section on GM menu tab", async ({ page }) => {
  const baseScript = getScript("Trouble Brewing");
  const scriptWithFabled = [
    ...baseScript,
    { id: "djinn" as Role },
    { id: "tor" as Role },
  ];

  const players = Array.from({ length: 10 }, (_, i) => `player${i}`);
  const { gameId, game } =
    await QuickSetupHelpers.createNewGame(scriptWithFabled);
  await QuickSetupHelpers.populateGameWithPlayers(players, gameId);
  await QuickSetupHelpers.assignSeats({ gameId, players });
  await QuickSetupHelpers.fillRoleBag({
    script: baseScript,
    gameId,
    playerCount: players.length,
  });

  await page.goto(
    urlFromBase("gm", { gameId, gmSecretHash: game.gmSecretHash }),
  );

  await page.getByRole("tab", { name: /menu/i }).click();
  await page.getByRole("button", { name: "Start Game" }).click();
  await page.getByRole("button", { name: "Start Game" }).click();

  // After game starts, menu tab shows ScriptList
  await page.getByRole("tab", { name: /menu/i }).click();

  await expect(page.getByText("Fabled/Loric")).toBeVisible();
  await expect(page.getByText("Djinn")).toBeVisible();
  await expect(page.getByText("Tor")).toBeVisible();
});
