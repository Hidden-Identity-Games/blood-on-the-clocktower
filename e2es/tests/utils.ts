import { Page } from "@playwright/test";

export async function createNewGame(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Create" }).click();

  const url = new URL(page.url());
  return url.pathname.split("/")[1];
}