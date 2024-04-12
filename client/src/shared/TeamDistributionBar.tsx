import {
  type CharacterType,
  type Role,
  type UnifiedGame,
} from "@hidden-identity/shared";
import {
  DistributionsByPlayerCount,
  getCharacter,
} from "@hidden-identity/shared";
import { Flex, Text } from "@radix-ui/themes";

import { colorMap } from "./CharacterTypes";

interface TeamDistributionBarProps {
  charsSelected?: Role[];
  targetPlayerCount: number;
}

interface CharacterTypeSectionProps {
  targetPlayerCount: number;
  charsSelected?: Role[];
  charType: CharacterType;
}

function CharacterTypeSection({
  charsSelected,
  charType,
  targetPlayerCount,
}: CharacterTypeSectionProps) {
  const target = getDistribution(targetPlayerCount, charType) ?? "?";
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
  targetPlayerCount,
}: TeamDistributionBarProps) {
  return (
    <>
      <Flex wrap="wrap">
        <CharacterTypeSection
          targetPlayerCount={targetPlayerCount}
          charsSelected={charsSelected}
          charType="Townsfolk"
        />
        <CharacterTypeSection
          targetPlayerCount={targetPlayerCount}
          charsSelected={charsSelected}
          charType="Outsider"
        />
        <CharacterTypeSection
          targetPlayerCount={targetPlayerCount}
          charsSelected={charsSelected}
          charType="Minion"
        />
        <CharacterTypeSection
          targetPlayerCount={targetPlayerCount}
          charsSelected={charsSelected}
          charType="Demon"
        />
      </Flex>
    </>
  );
}

export function allNonTravelers(game: UnifiedGame) {
  return game.playerList.filter((player) => !game.travelers[player]);
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
