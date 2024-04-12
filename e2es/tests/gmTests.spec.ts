import { getScript } from "@hidden-identity/shared";
import { expect, test } from "@playwright/test";

import { ClickthroughModel } from "./helpers/clickthroughHelpers";
import { QuickSetupHelpers } from "./helpers/quickHelpers";
import { assertCharacterDistributions } from "./helpers/selectors";
import { urlFromBase } from "./productUrls";

test("can create game", async ({ page }) => {
  const gameId = await ClickthroughModel.createNewGame(page, "Bad Moon Rising");
  await expect(
    page.getByRole("button", { name: `Game: ${gameId}` }),
  ).toBeVisible();
});

test("cannot start game with too few roles", async ({ page }) => {
  const players = Array.from({ length: 7 }, (_, i) => `player${i}`);
  const { gameId, game } = await QuickSetupHelpers.createNewGame(
    getScript("Trouble Brewing"),
  );
  await QuickSetupHelpers.populateGameWithPlayers(players, gameId);
  await QuickSetupHelpers.assignSeats({ gameId, players });
  await page.goto(
    urlFromBase("gm", { gameId, gmSecretHash: game.gmSecretHash }),
  );
  await page.getByRole("tab", { name: /menu/i }).click();
  const startGameButton1 = page.getByRole("button", {
    name: "Start Game",
  });
  // Don't actually do this, it makes bad tests, but I want this here to trust this test more for now.
  // Always assert LAST
  await expect(startGameButton1).toBeDisabled();
});

test("can start game", async ({ page }) => {
  const script = "Trouble Brewing";
  const players = Array.from({ length: 10 }, (_, i) => `player${i}`);
  const gameId = await ClickthroughModel.createNewGame(page, script);

  await page.getByRole("checkbox", { name: "Washerwoman" }).waitFor();

  await ClickthroughModel.fillRoleBag(page, {
    script: getScript(script),
    playerCount: players.length,
  });

  await QuickSetupHelpers.populateGameWithPlayers(players, gameId);
  await QuickSetupHelpers.assignSeats({ gameId, players });

  await page.getByRole("tab", { name: /menu/i }).click();
  await page
    .getByRole("button", {
      name: "Start Game",
    })
    .click();

  await page
    .getByRole("button", {
      name: "Start Game",
    })
    .click();

  await expect(page.getByRole("tab", { name: "night" })).toBeEnabled();
});

// eslint-disable-next-line playwright/expect-expect
test("can use player estimates", async ({ page }) => {
  const script = "Trouble Brewing";
  const players = Array.from({ length: 12 }, (_, i) => `player${i}`);
  await ClickthroughModel.createNewGame(page, script);

  await page.getByRole("checkbox", { name: "Washerwoman" }).waitFor();

  await ClickthroughModel.setPlayerEstimate(page, players.length);

  await ClickthroughModel.fillRoleBag(page, {
    script: getScript(script),
    playerCount: players.length,
  });

  await assertCharacterDistributions(page, "Demon", 1);
  await assertCharacterDistributions(page, "Minion", 2);
  await assertCharacterDistributions(page, "Outsider", 2);
  await assertCharacterDistributions(page, "Townsfolk", 7);
});

// eslint-disable-next-line playwright/expect-expect
test("can generate roles for a script", async ({ page }) => {
  const players = Array.from({ length: 12 }, (_, i) => `player${i}`);
  await ClickthroughModel.createNewGame(page, "Trouble Brewing");

  await page.getByRole("checkbox", { name: "Washerwoman" }).waitFor();

  await ClickthroughModel.generateRandomRoles(page, {
    playerCount: players.length,
  });

  await assertCharacterDistributions(page, "Demon", 1);
  await assertCharacterDistributions(page, "Minion", 2);
  await assertCharacterDistributions(page, "Outsider", 2);
  await assertCharacterDistributions(page, "Townsfolk", 7);
});
