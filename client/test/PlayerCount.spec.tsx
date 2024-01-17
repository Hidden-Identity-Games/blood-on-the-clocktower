import {
  CharacterTypes,
  DistributionsByPlayerCount,
  type Role,
} from "@hidden-identity/shared";
import { describe, expect, it } from "vitest";

import { TeamDistributionBar } from "../src/shared/TeamDistributionBar.tsx";
import { render, screen } from "./testUtils.tsx";

function createPlayers(playerCount: number) {
  return Array.from({ length: playerCount }, (_, i) => `player_${i}`);
}

describe("TeamDistributionBar", () => {
  describe.each(
    Object.keys(DistributionsByPlayerCount).map((playerCount) => ({
      playerCount: Number(playerCount),
    })),
  )("$playerCount", ({ playerCount }) => {
    describe("targets", () => {
      it("all categories sum to player count", () => {
        const players = createPlayers(playerCount);
        render(<TeamDistributionBar />, {
          gameContext: {
            gameId: "test",
            game: {
              playerList: players,
              travelers: Object.fromEntries(players.map((p) => [p, false])),
            },
          },
        });
        const allRoleMarkers = screen.getAllByTestId(/-distribution-target/);

        expect(allRoleMarkers).toHaveLength(4);
        const sum = allRoleMarkers
          .map((marker) => Number(marker.textContent))
          .reduce((a, b) => a + b);
        expect(sum).toEqual(playerCount);
      });
      describe.each(
        CharacterTypes.filter((team) => team !== "Traveler").map((team) => ({
          team,
        })),
      )("$team", ({ team }) => {
        it("shows matching number", () => {
          const players = createPlayers(playerCount);
          render(<TeamDistributionBar />, {
            gameContext: {
              gameId: "test",
              game: {
                playerList: players,
                travelers: Object.fromEntries(players.map((p) => [p, false])),
              },
            },
          });

          expect(
            screen.getByTestId(`${team}-distribution-target`),
          ).toHaveTextContent(
            String(DistributionsByPlayerCount[playerCount][team]),
          );
        });
      });
    });
  });
  describe("charsSelected", () => {
    it("hides count and slash if not provided", () => {
      const players = createPlayers(10);
      render(<TeamDistributionBar />, {
        gameContext: {
          gameId: "test",
          game: {
            playerList: players,
            travelers: Object.fromEntries(players.map((p) => [p, false])),
          },
        },
      });
      const allRoleMarkers = screen.queryAllByTestId(/-distribution-count/);
      expect(allRoleMarkers).toHaveLength(0);
      screen.getAllByTestId(/-distribution$/).forEach((element) => {
        expect(element).not.toHaveTextContent(/\//);
      });
    });
    it("shows correct counts when passed teams lists", () => {
      const players = createPlayers(6);
      render(
        <TeamDistributionBar
          charsSelected={
            [
              // Demon: 1
              "imp",
              // Minions: 1
              "baron",
              // Outsiders: 1
              "recluse",
              // Townsfolk: 3
              "washerwoman",
              "chef",
              "investigator",
            ] as Role[]
          }
        />,
        {
          gameContext: {
            gameId: "test",
            game: {
              playerList: players,
              travelers: Object.fromEntries(players.map((p) => [p, false])),
            },
          },
        },
      );
      expect(screen.getByTestId(`Demon-distribution`)).toHaveTextContent(
        "Demon1/1",
      );
      expect(screen.getByTestId(`Minion-distribution`)).toHaveTextContent(
        "Minion1/1",
      );
      expect(screen.getByTestId(`Outsider-distribution`)).toHaveTextContent(
        "Outsider1/1",
      );
      expect(screen.getByTestId(`Townsfolk-distribution`)).toHaveTextContent(
        "Townsfolk3/3",
      );
    });
  });
});
