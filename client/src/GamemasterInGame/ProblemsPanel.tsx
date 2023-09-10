import { Flex, Heading, Text } from "@radix-ui/themes";
import { useDefiniteGame } from "../store/GameContext";

export function ProblemsPanel() {
  const { game } = useDefiniteGame();
  if (!game.orderedPlayers.problems) {
    throw new Error("No errors");
  }
  return (
    <Flex direction="column" gap="2">
      <Heading>
        There's some problems in player order preventing export. We're waiting
        on these players to fix problems.
      </Heading>
      {Object.keys(game.orderedPlayers.playerProblems).map((player) => (
        <Text key="name" as="div" className="capitalize">
          {player}
        </Text>
      ))}
    </Flex>
  );
}
