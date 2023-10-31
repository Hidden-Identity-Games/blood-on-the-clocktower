import { Page } from "@playwright/test";

export async function createNewGame(page: Page, script: string) {
  await page.goto("/");
  await page.getByRole("button", { name: "Create" }).click();
  await page
    .getByRole("button", {
      name: script,
    })
    .click();
  await page.getByRole("button", { name: "Create" }).click();

  await page.waitForURL(/\/gm\//);

  const url = new URL(page.url());
  return url.pathname.split("/")[1];
}
