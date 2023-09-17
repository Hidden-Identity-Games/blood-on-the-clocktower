import { Flex, Text } from "@radix-ui/themes";
import { useGame } from "../store/GameContext";
import "./TeamDistributionBar.css";
import { colorMap } from "../shared/CharacterTypes";
import { KnownCharacterType, Role } from "@hidden-identity/server";
import { getCharacter } from "../assets/game_data/gameData";

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

function TeamDistributionBar({ charsSelected }: TeamDistributionBarProps) {
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

export default TeamDistributionBar;

const DistributionsByPlayerCount: Record<
  number,
  Record<KnownCharacterType, number>
> = {
  5: { Townsfolk: 3, Outsider: 0, Minion: 1, Demon: 1, Traveler: 0 },
  6: { Townsfolk: 3, Outsider: 1, Minion: 1, Demon: 1, Traveler: 0 },
  7: { Townsfolk: 5, Outsider: 0, Minion: 1, Demon: 1, Traveler: 0 },
  8: { Townsfolk: 5, Outsider: 1, Minion: 1, Demon: 1, Traveler: 0 },
  9: { Townsfolk: 5, Outsider: 2, Minion: 1, Demon: 1, Traveler: 0 },
  10: { Townsfolk: 7, Outsider: 0, Minion: 2, Demon: 1, Traveler: 0 },
  11: { Townsfolk: 7, Outsider: 1, Minion: 2, Demon: 1, Traveler: 0 },
  12: { Townsfolk: 7, Outsider: 2, Minion: 2, Demon: 1, Traveler: 0 },
  13: { Townsfolk: 9, Outsider: 0, Minion: 3, Demon: 1, Traveler: 0 },
  14: { Townsfolk: 9, Outsider: 1, Minion: 3, Demon: 1, Traveler: 0 },
  15: { Townsfolk: 9, Outsider: 2, Minion: 3, Demon: 1, Traveler: 0 },
};

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
