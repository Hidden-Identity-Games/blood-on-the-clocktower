import { type CharacterType, type Role } from "@hidden-identity/shared";
import {
  DistributionsByPlayerCount,
  getCharacter,
} from "@hidden-identity/shared";
import { Flex, Text } from "@radix-ui/themes";

import { useGame } from "../store/GameContext";
import { colorMap } from "./CharacterTypes";

interface TeamDistributionBarProps {
  charsSelected?: Role[];
}

interface CharacterTypeSectionProps {
  charsSelected?: Role[];
  charType: CharacterType;
}

function CharacterTypeSection({
  charsSelected,
  charType,
}: CharacterTypeSectionProps) {
  const { game } = useGame();
  if (!game) {
    return;
  }

  const target =
    getDistribution(
      game.playerList.filter((player) => !game.travelers[player]).length,
      charType,
    ) ?? "?";

  return (
    <Text
      color={colorMap[charType]}
      className="min-w-[80px] flex-1 text-center"
      onClick={() => {
        document.querySelector(`#${charType}`)?.scrollIntoView();
      }}
      data-testid={`${charType}-distribution`}
    >
      <Text
        size="1"
        as="div"
        className="text-clip whitespace-nowrap"
        style={{
          fontSize: 16,
        }}
      >
        {charType}
      </Text>

      {charsSelected && (
        <>
          <span data-testid={`${charType}-distribution-count`}>
            {uniqueCharsByTeam(charType, charsSelected)}
          </span>
          {"/"}
        </>
      )}

      <span data-testid={`${charType}-distribution-target`}>{target}</span>
    </Text>
  );
}

export function TeamDistributionBar({
  charsSelected,
}: TeamDistributionBarProps) {
  return (
    <>
      <Flex wrap="wrap">
        <CharacterTypeSection
          charsSelected={charsSelected}
          charType="Townsfolk"
        />
        <CharacterTypeSection
          charsSelected={charsSelected}
          charType="Outsider"
        />
        <CharacterTypeSection charsSelected={charsSelected} charType="Minion" />
        <CharacterTypeSection charsSelected={charsSelected} charType="Demon" />
      </Flex>
    </>
  );
}

function uniqueCharsByTeam(team: string, charsSelected: Role[]) {
  return charsSelected
    .map((char) => getCharacter(char))
    .filter(Boolean)
    .filter((char) => char.team === team)
    .map(({ name }) => name).length;
}

function getDistribution(
  playerCount: number,
  characterType: CharacterType,
): number | null {
  const distribution =
    playerCount in DistributionsByPlayerCount
      ? DistributionsByPlayerCount[playerCount]
      : null;

  return distribution?.[characterType] ?? null;
}
