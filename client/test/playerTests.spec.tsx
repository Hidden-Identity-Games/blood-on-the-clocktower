import { describe, expect, test } from "vitest";
import { screen, render } from "./testUtils.tsx";
import { TeamDistributionBar } from "../src/shared/TeamDistributionBar.tsx";
import {
  DistributionsByPlayerCount,
  Role,
  UnifiedGame,
} from "@hidden-identity/shared";
import { QuickSetupHelpers } from "./quickHelpers.ts";

describe("Team distribution", () => {
  test("distribution counts are correct for number of players", () => {
    const roles = Array.from({ length: 15 }).reduce<Record<string, Role>>(
      (acc, _, idx) => {
        return { ...acc, [idx]: "washerwoman" as Role };
      },
      {},
    );

    // 9, 2, 3, 1
    const expectedTeamDistributions =
      DistributionsByPlayerCount[Object.keys(roles).length];
    const game: UnifiedGame = {
      ...QuickSetupHelpers.getEmptyGame(),
      playersToRoles: roles,
    };

    render(<TeamDistributionBar />, {
      gameContext: { gameId: "ABCDE", game, script: null },
    });

    expect(
      screen.getByText(expectedTeamDistributions["Townsfolk"]),
    ).toBeInTheDocument();
    expect(
      screen.getByText(expectedTeamDistributions["Outsider"]),
    ).toBeInTheDocument();
    expect(
      screen.getByText(expectedTeamDistributions["Minion"]),
    ).toBeInTheDocument();
    expect(
      screen.getByText(expectedTeamDistributions["Demon"]),
    ).toBeInTheDocument();
  });
});
