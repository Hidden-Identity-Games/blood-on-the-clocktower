import { type CharacterType } from "@hidden-identity/shared";
import { type Page } from "playwright";

export async function findCharacterDistributionCounts(
  page: Page,
  team: CharacterType,
) {
  const count = Number(
    await page.getByTestId(`${team}-distribution-count`).textContent(),
  );
  const target = Number(
    await page.getByTestId(`${team}-distribution-target`).textContent(),
  );

  return { count, target };
}
