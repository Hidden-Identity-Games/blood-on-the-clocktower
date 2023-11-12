import { urlFromBase } from "./productUrls";
import { Page } from "@playwright/test";

export async function createNewGame(page: Page, script: string) {
  await page.goto(urlFromBase("", {}));
  await page.getByRole("button", { name: "Create" }).click();
  await page
    .getByRole("button", {
      name: script,
    })
    .click();
  await page.getByRole("button", { name: "Create" }).click();

  await page.waitForURL(/\/gm/);

  const url = new URL(page.url());
  return url.searchParams.get("gameId")!;
}

export async function joinGameAs(
  page: Page,
  gameId: string,
  playerName: string,
) {
  await page.getByRole("button", { name: "Join game" }).click();
  await page.getByRole("textbox", { name: "code" }).fill(gameId);
  await page.getByRole("button", { name: "Join" }).click();
  await page.getByRole("textbox", { name: "name" }).fill(playerName);
  await page.getByRole("button", { name: "Join" }).click();
}
