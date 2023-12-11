import { test, expect } from "@playwright/test";
import { urlFromBase } from "./productUrls";

test("can create game", async ({ page }) => {
  await page.goto(urlFromBase("", {}));
  await page.getByRole("button", { name: "Create" }).click();
  await page
    .getByRole("button", {
      name: "Sects & Violets",
    })
    .click();
  await page.getByRole("button", { name: "Create" }).click();

  await page.waitForURL(/\/gm/);

  const url = new URL(page.url());
  const gameID = url.searchParams.get("gameId")!;
  await expect(
    page.getByRole("button", { name: `Game: ${gameID}` }),
  ).toBeVisible();
});
