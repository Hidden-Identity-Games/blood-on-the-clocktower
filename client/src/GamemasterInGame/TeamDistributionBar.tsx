import { Flex, Text } from "@radix-ui/themes";
import { useGame } from "../store/GameContext";
import "./TeamDistributionBar.css";
import { colorMap } from "../shared/CharacterTypes";
import { KnownCharacterType, Role } from "@hidden-identity/server";
import {
  DistributionsByPlayerCount,
  getCharacter,
} from "../assets/game_data/gameData";

interface TeamDistributionBarProps {
  charsSelected: Role[];
}

interface CharacterTypeSectionProps {
  charsSelected: Role[];
  charType: KnownCharacterType;
}

function CharacterTypeSection({
  charsSelected,
  charType,
}: CharacterTypeSectionProps) {
  const { game } = useGame();
  if (!game) {
    return;
  }
  const target = getDistribution(
    Object.keys(game.playersToRoles).length,
    charType,
  );

  return (
    <Text
      color={colorMap[charType]}
      className="character-type-container"
      onClick={() => {
        document.querySelector(`#${charType}`)?.scrollIntoView();
      }}
    >
      <Text
        size="1"
        as="div"
        style={{
          textOverflow: "clip",
          whiteSpace: "nowrap",
          overflow: "hidden",
          fontSize: 16,
        }}
      >
        {charType}
      </Text>
      {uniqueCharsByTeam(charType, charsSelected)}
      {target != null && `/${target}`}
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
  characterType: KnownCharacterType,
): number | null {
  const distribution =
    playerCount in DistributionsByPlayerCount
      ? DistributionsByPlayerCount[playerCount]
      : null;

  return distribution?.[characterType] ?? null;
}
