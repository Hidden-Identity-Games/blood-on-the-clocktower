import { test, expect } from "@playwright/test";
import { createNewGame } from "./utils";

test("can create game", async ({ page }) => {
  const gameID = await createNewGame(page, "Sects & Violets");
  await expect(
    page.getByRole("button", { name: `Game: ${gameID}` }),
  ).toBeVisible();
});
