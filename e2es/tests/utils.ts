import { Page } from "@playwright/test";
import { v4 } from "uuid";

export async function createNewGame(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Create" }).click();
  await page.getByRole("heading", { name: "Status" }).waitFor();

  const url = new URL(page.url());
  return url.pathname.split("/")[1];
}

export async function playerJoinGame(
  page: Page,
  gameId: string,
  player: string = v4(),
) {
  await page.goto("/");
  await page.getByRole("button", { name: "Join" }).click();
  await page.getByRole("textbox", { name: "code" }).fill(gameId);
  await page.getByRole("button", { name: "Join" }).click();
  await page.getByRole("textbox", { name: "name" }).fill(player);
  await page.getByRole("button", { name: "Join" }).click();
}
