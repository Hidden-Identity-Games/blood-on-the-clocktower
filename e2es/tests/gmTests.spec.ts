import { getScript } from "@hidden-identity/shared";
import { expect, test } from "@playwright/test";

import { ClickthroughModel } from "./helpers/clickthroughHelpers";
import { QuickSetupHelpers } from "./helpers/quickHelpers";
import { findCharacterDistributionCounts } from "./helpers/selectors";
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

  // Not much of a better way to wait for the network to settle.
  // We can really only fix this by fixing loading states
  // eslint-disable-next-line playwright/no-wait-for-timeout
  await page.waitForTimeout(500);

  expect(await findCharacterDistributionCounts(page, "Demon")).toMatchObject({
    count: 1,
    target: 1,
  });
  expect(await findCharacterDistributionCounts(page, "Minion")).toMatchObject({
    count: 2,
    target: 2,
  });
  expect(await findCharacterDistributionCounts(page, "Outsider")).toMatchObject(
    { count: 2, target: 2 },
  );
  expect(
    await findCharacterDistributionCounts(page, "Townsfolk"),
  ).toMatchObject({ count: 7, target: 7 });
});

test("can generate roles for a script", async ({ page }) => {
  const players = Array.from({ length: 12 }, (_, i) => `player${i}`);
  await ClickthroughModel.createNewGame(page, "Trouble Brewing");

  await page.getByRole("checkbox", { name: "Washerwoman" }).waitFor();

  await ClickthroughModel.generateRandomRoles(page, {
    playerCount: players.length,
  });

  expect(await findCharacterDistributionCounts(page, "Demon")).toMatchObject({
    count: 1,
    target: 1,
  });
  expect(await findCharacterDistributionCounts(page, "Minion")).toMatchObject({
    count: 2,
    target: 2,
  });
  expect(await findCharacterDistributionCounts(page, "Outsider")).toMatchObject(
    { count: 2, target: 2 },
  );
  expect(
    await findCharacterDistributionCounts(page, "Townsfolk"),
  ).toMatchObject({ count: 7, target: 7 });
});
