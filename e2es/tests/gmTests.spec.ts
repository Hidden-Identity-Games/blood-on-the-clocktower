import { test, expect } from "@playwright/test";
import { createNewGame } from "./utils";

test("can create game", async ({ page }) => {
  await createNewGame(page);
  await expect(page.getByRole("heading", { name: "Script" })).toBeVisible();
});
