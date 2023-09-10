import { Flex, Heading } from "@radix-ui/themes";
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
    </Flex>
  );
}
