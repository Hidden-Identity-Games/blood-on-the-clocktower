import { test, expect } from "@playwright/test";
import { createNewGame } from "./utils";
import { v4 } from "uuid";

test("can join game", async ({ page }) => {
  const gameId = await createNewGame(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Join" }).click();
  await page.getByRole("textbox", { name: "code" }).fill(gameId);
  await page.getByRole("button", { name: "Join" }).click();
  await expect(page.url()).toContain(gameId);
});

test("can player join", async ({ page }) => {
  await page.goto("/test-game");
  await page.getByRole("textbox", { name: "name" }).fill(v4());
  await page.getByRole("button", { name: "Join" }).click();
  await expect(page.getByRole("button", { name: "Alex" })).toBeVisible();
});
