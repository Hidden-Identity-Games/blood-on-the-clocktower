import { test, expect } from "@playwright/test";
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
test.only("can 15 players join", async ({ context, page }) => {
  const gameId = await createNewGame(page);
  const size = 15;

  await Promise.all(
    Array.from({ length: size }).map(async (_, i) => {
      const name = `player${i}`;
      const myPage = await context.newPage();
      await myPage.goto(`/${gameId}?testPlayerKey=${i}`);
      await myPage.getByRole("textbox", { name: "NAME:" }).fill(name);
      await myPage.getByRole("button", { name: "Join" }).click();
      await myPage
        .getByRole("button", {
          name: `player${(i + 1) % size}`,
          exact: true,
        })
        .waitFor({ timeout: 4000 }); // This will require other pages to complete so we should wait longer.
      await myPage
        .getByRole("button", {
          name: `player${(i + 1) % size}`,
          exact: true,
        })
        .click();

      await myPage.getByText(`Hello ${name}`).waitFor({ timeout: 4000 });
      await myPage.waitForTimeout(1000);

      await expect(myPage.url()).toContain(gameId);
    }),
  );
});
