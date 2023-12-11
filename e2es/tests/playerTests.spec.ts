import { test, expect } from "@playwright/test";
import {
  acknowledgeRoles,
  addPlayerToGame,
  assignSeats,
  asyncMap,
  createNewGame,
  createStartableGame,
  populateGameWithPlayers,
  rejoinGameAs,
} from "./utils";

import { urlFromBase } from "./productUrls";
import { trpc } from "./api/client";

test("join game", async ({ page }) => {
  const gameId = await createNewGame("Trouble Brewing");
  await page.goto(urlFromBase("", {}));
  await page.getByRole("button", { name: "Join" }).click();
  await page.getByRole("textbox", { name: "code" }).fill(gameId);
  await page.getByRole("button", { name: "Join" }).click();
  await expect(page.url()).toMatch(new RegExp(gameId, "i"));
});

test("re-join game", async ({ page }) => {
  const gameId = await createNewGame("Trouble Brewing");

  await trpc.addPlayer.mutate({ gameId, player: "alex" });
  await trpc.addPlayer.mutate({ gameId, player: "steve" });

  await rejoinGameAs(page, gameId, "alex", "alex2");

  await expect(page.getByRole("button", { name: "steve" })).toBeVisible();
});

test("cannot start game with too few roles", async ({ page, context }) => {
  const players = Array.from({ length: 7 }, (_, i) => `player${i}`);
  const gameId = await createNewGame("Trouble Brewing");
  const pages = await populateGameWithPlayers(context, players, gameId);
  await assignSeats(pages);
  await page.getByRole("tab", { name: /menu/i }).click();
  const startGameButton1 = page.getByRole("button", {
    name: "Start Game",
  });
  // Don't actually do this, it makes bad tests, but I want this here to trust this test more for now.
  // Always assert LAST
  await expect(startGameButton1).toBeDisabled();
});

test("can 15 players join", async ({ context }) => {
  const size = 15;
  const players = Array.from({ length: size }, (_, i) => `player${i}`);

  const {
    playerPages: pages,
    gameId,
    gmPage,
  } = await createStartableGame(context, "Trouble Brewing", players);

  // We do these all sequentially because they bug out if you go too fast in CI.

  for (const playerNumber in players) {
    const { page: myPage } = pages[playerNumber];
    const name = `player${playerNumber}`;
    await myPage.getByText(`Hello ${name}`).waitFor({ timeout: 4000 });
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await myPage.waitForTimeout(100);
    await expect(myPage.url()).toContain(gameId);
  }

  // Proper way to expect somehting to be enabled
  await gmPage.getByRole("tab", { name: "menu" }).click();
  await gmPage
    .getByRole("button", {
      name: "Start Game",
    })
    .click({ trial: true, timeout: 1000 });
});

// eslint-disable-next-line playwright/no-skipped-test
test.skip("travelers keep player order", async ({ context }) => {
  const players = Array.from({ length: 8 }, (_, i) => `player${i}`);

  const {
    playerPages: pages,
    gameId,
    gmPage,
  } = await createStartableGame(context, "Trouble Brewing", players);

  // Proper way to expect somehting to be enabled
  await gmPage.getByRole("tab", { name: "menu" }).click();
  await gmPage
    .getByRole("button", {
      name: "Start Game",
    })
    .click();
  // click confirmation
  await gmPage
    .getByRole("button", {
      name: "Start Game",
    })
    .click();

  await acknowledgeRoles(pages);
  await Promise.all(pages.map((p) => p.page.close()));
  // comparing ordere is fucking hard
  async function getOrderedValues() {
    const allPlayerTiles = await gmPage.getByTestId(/tile_/).all();

    return await asyncMap(
      allPlayerTiles,
      async (tile) =>
        (await tile.getAttribute("data-testid"))
          ?.replace(/tile_/i, "")
          ?.toLocaleLowerCase(),
    );
  }

  const expectedOrderedValues = players;
  const playersFromDom = await getOrderedValues();
  expect(playersFromDom).toMatchObject(expectedOrderedValues);
  expect(playersFromDom.length).toEqual(players.length);

  const insertTravelerBefore = 4;
  const travelerName = "traveling bob";
  const travelerPage = await addPlayerToGame(context, gameId, travelerName);
  await travelerPage
    .getByRole("button", {
      name: players[insertTravelerBefore],
      exact: true,
    })
    .click();

  const postTravelersOrderedValues = [
    ...expectedOrderedValues.slice(0, insertTravelerBefore),
    travelerName,
    ...expectedOrderedValues.slice(insertTravelerBefore),
  ];

  expect(await getOrderedValues()).toMatchObject(postTravelersOrderedValues);
});
