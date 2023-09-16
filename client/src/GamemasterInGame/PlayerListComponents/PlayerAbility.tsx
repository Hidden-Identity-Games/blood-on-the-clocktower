import { UnifiedGame } from "@hidden-identity/server";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { getCharacter } from "../../assets/game_data/gameData";
import { useDefiniteGame } from "../../store/GameContext";

type AbilityKey = "ability" | "firstNight" | "otherNight";

function getAbilityKey(game: UnifiedGame, night?: boolean): AbilityKey {
  if (!night) {
    return "ability";
  }

  return game.gameStatus === "Setup" ? "firstNight" : "otherNight";
}

export function PlayerAbility({
  player,
  night,
}: {
  player: string;
  night?: boolean;
}) {
  const { game } = useDefiniteGame();
  const character = getCharacter(game.playersToRoles[player]);
  const abilityKey = getAbilityKey(game, night);
  const ability =
    abilityKey === "ability"
      ? character[abilityKey]
      : character[abilityKey]?.reminder;

  if (!ability) {
    if (abilityKey === "ability") {
      throw new Error(`No ability found for character ${character.id}`);
    }
    return (
      <Flex gap="2" direction="column">
        <Heading>DOES NOT ACT TONIGHT</Heading>
        <Text as="div">{character.ability}</Text>
      </Flex>
    );
  }

  return <div>{ability}</div>;
}
