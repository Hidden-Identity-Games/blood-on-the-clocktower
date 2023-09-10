import { Flex, Heading, Text } from "@radix-ui/themes";
import { useDefiniteGame } from "../store/GameContext";

export function ProblemsPanel() {
  const { game } = useDefiniteGame();
  if (!game.orderedPlayers.problems) {
    throw new Error("No errors");
  }
  return (
    <Flex direction="column" gap="4">
      <Heading>
        There's some problems in player order preventing export:
      </Heading>
      {game.orderedPlayers.brokenLinks.length > 0 && (
        <Text>
          Waiting on players to select neighbors:{" "}
          {game.orderedPlayers.brokenLinks.join(", ")}
        </Text>
      )}
      {game.orderedPlayers.spidermanPointing.length > 0 && (
        <Text>
          Some folks are pointing at each other:{" "}
          {game.orderedPlayers.spidermanPointing
            .map((c) => c.join("<>"))
            .join("|")}
        </Text>
      )}
      {Object.keys(game.orderedPlayers.excludedPlayers).length > 0 && (
        <Text>
          Some players have been excluded:{" "}
          {Object.values(game.orderedPlayers.excludedPlayers).join(",")}
        </Text>
      )}
    </Flex>
  );
}
