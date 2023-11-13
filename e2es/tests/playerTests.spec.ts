import { test, expect } from "@playwright/test";
import {
  addPlayerToGame,
  assignRoles,
  createNewGame,
  populateGameWithPlayers,
  rejoinGameAs,
} from "./utils";

import { urlFromBase } from "./productUrls";

test("join game", async ({ page }) => {
  const gameId = await createNewGame(page, "Trouble Brewing");
  await page.goto(urlFromBase("", {}));
  await page.getByRole("button", { name: "Join" }).click();
  await page.getByRole("textbox", { name: "code" }).fill(gameId);
  await page.getByRole("button", { name: "Join" }).click();
  await expect(page.url()).toContain(gameId);
});

test("re-join game", async ({ page, context }) => {
  const gameId = await createNewGame(page, "Trouble Brewing");

  await addPlayerToGame(context, gameId, "Alex");
  await addPlayerToGame(context, gameId, "Steve");

  await rejoinGameAs(page, gameId, "Alex");

  await expect(page.getByRole("button", { name: "Steve" })).toBeVisible();
});

test("can 15 players join", async ({ context, page }) => {
  const gameId = await createNewGame(page, "Trouble Brewing");
  const size = 15;
  await page.getByRole("button", { name: "desktop" }).click();
  await page.getByRole("checkbox", { name: "Washerwoman" }).waitFor();
  const roleIds = [
    "Washerwoman",
    "Librarian",
    "Investigator",
    "Chef",
    "Empath",
    "Fortune Teller",
    "Undertaker",
    "Monk",
    "Ravenkeeper",
    "Virgin",
    "Slayer",
    "Soldier",
    "Mayor",
    "Butler",
    "Recluse",
    "Saint",
    "Poisoner",
    "Spy",
    "Scarlet Woman",
    "Baron",
    "Imp",
  ];

  for await (const role of roleIds.slice(0, size)) {
    await page.getByRole("checkbox", { name: role }).click();
  }
  await page.getByRole("tab", { name: "menu" }).click();
  const startGameButton1 = await page.getByRole("button", {
    name: "Start Game",
  });
  // Don't actually do this, it makes bad tests, but I want this here to trust this test more for now.
  // Always assert LAST
  expect(startGameButton1).toBeDisabled();

  const players = Array.from({ length: size }, (_, i) => `player${i}`);
  const pages = await populateGameWithPlayers(context, players, gameId);
  await assignRoles(pages);

  // We do these all sequentially because they bug out if you go too fast in CI.

  for (const playerNumber in players) {
    const { page: myPage } = pages[playerNumber];
    const name = `player${playerNumber}`;
    await myPage.getByText(`Hello ${name}`).waitFor({ timeout: 4000 });
    await myPage.waitForTimeout(100);
    await expect(myPage.url()).toContain(gameId);
  }

  // Proper way to expect somehting to be enabled
  await page
    .getByRole("button", {
      name: "Start Game",
    })
    .click({ trial: true, timeout: 1000 });
});
