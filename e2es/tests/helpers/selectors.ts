import { type CharacterType } from "@hidden-identity/shared";
import { expect } from "@playwright/test";
import { type Page } from "playwright";

export function findCharacterDistributionCounts(
  page: Page,
  team: CharacterType,
) {
  const count = page.getByTestId(`${team}-distribution-count`);

  const target = page.getByTestId(`${team}-distribution-target`);

  return { count, target };
}

export async function assertCharacterDistributions(
  page: Page,
  team: CharacterType,
  target: number,
) {
  await expect(findCharacterDistributionCounts(page, team).count).toContainText(
    String(target),
  );

  await expect(
    findCharacterDistributionCounts(page, team).target,
  ).toContainText(String(target));
}
