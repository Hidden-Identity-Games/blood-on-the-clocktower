import { Flex, Text } from "@radix-ui/themes";
import { Character } from "../types/script";

interface TeamDistributionBarProps {
  charsSelected: Character[];
}

function TeamDistributionBar({ charsSelected }: TeamDistributionBarProps) {
  return (
    <Flex>
      <Text as="span" style={{ flex: 1 }} color="blue">
        Townsfolk:{"  "}
        {uniqueCharsByTeam("Townsfolk", charsSelected)}
      </Text>
      <Text as="span" style={{ flex: 1 }} color="teal">
        Outsiders:{"  "}
        {uniqueCharsByTeam("Outsider", charsSelected)}
      </Text>
      <Text as="span" style={{ flex: 1 }} color="crimson">
        Minions:{"  "}
        {uniqueCharsByTeam("Minion", charsSelected)}
      </Text>
      <Text as="span" style={{ flex: 1 }} color="tomato">
        Demons:{"  "}
        {uniqueCharsByTeam("Demon", charsSelected)}
      </Text>
    </Flex>
  );
}

function uniqueCharsByTeam(team: string, charsSelected: Character[]) {
  return [
    ...new Set(
      charsSelected
        .filter((char) => char.team === team)
        .map(({ name }) => name),
    ),
  ].length;
}

export default TeamDistributionBar;
