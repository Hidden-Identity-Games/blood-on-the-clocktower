import { getScript } from "@hidden-identity/shared";
import { expect, test } from "@playwright/test";

import { trpc } from "./api/client";
import { ClickthroughModel } from "./helpers/clickthroughHelpers";
import { QuickSetupHelpers } from "./helpers/quickHelpers";

test("join game", async ({ page }) => {
  const { gameId } = await QuickSetupHelpers.createNewGame(
    getScript("Trouble Brewing"),
  );
  await ClickthroughModel.openHomePage(page);
  await page.getByRole("button", { name: "Join" }).click();
  await page.getByRole("textbox", { name: "code" }).fill(gameId);
  await page.getByRole("button", { name: "Join" }).click();
  expect(page.url()).toMatch(new RegExp(gameId, "i"));
});

test("re-join game", async ({ page }) => {
  const { gameId } = await QuickSetupHelpers.createNewGame(
    getScript("Trouble Brewing"),
  );
  await trpc.addPlayer.mutate({ gameId, player: "alex" });
  await trpc.addPlayer.mutate({ gameId, player: "steve" });

  await ClickthroughModel.rejoinGameAs(page, gameId, "alex", "alex2");

  await expect(page.getByRole("button", { name: "steve" })).toBeVisible();
});

test("can 15 players join", async ({ context }) => {
  const size = 15;
  const players = Array.from({ length: size }, (_, i) => `player${i}`);
  const script = "Trouble Brewing";

  const { gameId } = await QuickSetupHelpers.createNewGame(getScript(script));

  const playerPages = await ClickthroughModel.populateGameWithPlayers(
    context,
    players,
    gameId,
  );
  await ClickthroughModel.assignSeats(playerPages);

  // We do these all sequentially because they bug out if you go too fast in CI.

  // eslint-disable-next-line @typescript-eslint/no-for-in-array
  for (const playerNumber in players) {
    const { page: myPage } = playerPages[playerNumber];
    const name = `player${playerNumber}`;
    await myPage.getByText(`Hello ${name}`).waitFor({ timeout: 4000 });
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await myPage.waitForTimeout(100);
    expect(myPage.url()).toContain(gameId);
  }

  await QuickSetupHelpers.fillRoleBag({
    script: getScript(script),
    gameId,
    playerCount: players.length,
  });

  await ClickthroughModel.getAndAcknowledgeRoles(playerPages);

  for (const { page: myPage } of playerPages) {
    await expect(myPage.getByRole("tab", { name: /script/i })).toBeEnabled();
  }

  const { gameStatus } = await trpc.getGame.query({ gameId });
  expect(gameStatus).toBe("Setup");
});

// currently broken
test("travelers keep player order", async ({ context }) => {
  const players = Array.from({ length: 8 }, (_, i) => `player${i}`);

  const { gameId } = await QuickSetupHelpers.createStartedGame(
    "Trouble Brewing",
    players,
  );

  const { orderedPlayers: expectedOrderedValues } = await trpc.getGame.query({
    gameId,
  });

  const insertTravelerBefore = 4;
  const travelerName = "traveling bob";
  const travelerPage = await ClickthroughModel.addPlayerToGame(
    context,
    gameId,
    travelerName,
  );
  await travelerPage
    .getByRole("button", {
      name: expectedOrderedValues.fullList[insertTravelerBefore],
      exact: true,
    })
    .click();

  const postTravelersOrderedValues = [
    ...expectedOrderedValues.fullList.slice(0, insertTravelerBefore),
    travelerName,
    ...expectedOrderedValues.fullList.slice(insertTravelerBefore),
  ];

  const { orderedPlayers: actualPlayerOrder } = await trpc.getGame.query({
    gameId,
  });

  expect(actualPlayerOrder.fullList).toMatchObject(postTravelersOrderedValues);
});
