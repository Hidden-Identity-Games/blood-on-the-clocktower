import { test, expect, Page } from "@playwright/test";
import { createNewGame } from "./utils";
import { v4 } from "uuid";

test("join game", async ({ page }) => {
  const gameId = await createNewGame(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Join" }).click();
  await page.getByRole("textbox", { name: "code" }).fill(gameId);
  await page.getByRole("button", { name: "Join" }).click();
  await expect(page.url()).toContain(gameId);
});

test("re-join game", async ({ page }) => {
  await page.goto("/test-game");
  await page.getByRole("textbox", { name: "name" }).fill(v4());
  await page.getByRole("button", { name: "Join" }).click();
  await expect(page.getByRole("button", { name: "Alex" })).toBeVisible();
});

test("can 15 players join", async ({ context, page }) => {
  const gameId = await createNewGame(page);
  const size = 15;
  await page
    .getByRole("button", {
      name: "Trouble Brewing",
    })
    .click();
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

  const startGameButton1 = await page.getByRole("button", {
    name: "Start Game",
  });
  // Don't actually do this, it makes bad tests, but I want this here to trust this test more for now.
  // Always assert LAST
  expect(startGameButton1).toBeDisabled();

  const players = Array.from({ length: size }, (_, i) => i);
  const pages: Page[] = [];

  // We do these all sequentially because they bug out if you go too fast in CI.
  for (const playerNumber of players) {
    const name = `player${playerNumber}`;
    const myPage = await context.newPage();
    await myPage.goto(`/${gameId}?testPlayerKey=${playerNumber}`);
    await myPage.getByRole("textbox", { name: "NAME:" }).fill(name);
    await myPage.getByRole("button", { name: "Join" }).click();
    await page.waitForTimeout(1000);
    pages.push(myPage);
  }

  for (const playerNumber of players) {
    const myPage = pages[playerNumber];
    const nextPlayerNumber = (playerNumber + 1) % size;
    await myPage
      .getByRole("button", {
        name: `player${nextPlayerNumber}`,
        exact: true,
      })
      .waitFor();
    await myPage
      .getByRole("button", {
        name: `player${nextPlayerNumber}`,
        exact: true,
      })
      .click();
  }

  for (const playerNumber of players) {
    const myPage = pages[playerNumber];
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
