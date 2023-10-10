import { test, expect } from "@playwright/test";
import { createNewGame, playerJoinGame } from "./utils";

test("can create game", async ({ page }) => {
  await createNewGame(page);
  await expect(page.getByRole("heading", { name: "Script" })).toBeVisible();
});

test.describe("Smoke test", () => {
  const players = [
    "Alex",
    "Tom",
    // "Tali",
    // "Mrinal",
    // "Jess",
    // "Joey",
    // "Maddie",
    // "Veronika",
    // "Kennedy",
    // "Cameron",
    // "Adin",
    // "Luna",
    // "Hank",
    // "Daniel",
    // "Nadir",
  ];

  test("run game", async ({ context, page }) => {
    const gameId = await createNewGame(page);

    Promise.all(
      players.map(async (player, idx) => {
        const playerPage = await context.newPage();
        await playerJoinGame(playerPage, gameId, players[idx]);
        await playerPage
          .getByRole("button", { name: players[(idx + 1) % players.length] })
          .click();
      }),
    );
  });
});
