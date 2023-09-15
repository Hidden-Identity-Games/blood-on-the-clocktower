import { UnifiedGame } from "@hidden-identity/server";
import { Text } from "@radix-ui/themes";
import { getRoleExtension } from "../../assets/game_data/gameData";
import { useDefiniteGame } from "../../store/GameContext";

type AbilityKey = "ability" | "firstNightReminder" | "otherNightReminder";

function getAbilityKey(game: UnifiedGame, night?: boolean): AbilityKey {
  if (!night) {
    return "ability";
  }

  return game.gameStatus === "Setup"
    ? "firstNightReminder"
    : "otherNightReminder";
}

export function PlayerAbility({
  player,
  night,
}: {
  player: string;
  night?: boolean;
}) {
  const { game } = useDefiniteGame();
  const character = getRoleExtension(game.playersToRoles[player]);
  const abilityKey = getAbilityKey(game, night);
  const ability = character[abilityKey];

  if (!ability) {
    if (ability === "ability") {
      throw new Error(`No ability found for character ${character.id}`);
    }
    return (
      <div>
        <Text as="div" color="ruby">
          DOES NOT ACT TONIGHT
        </Text>
        <Text as="div" color="ruby">
          {character.ability}
        </Text>
      </div>
    );
  }

  return <div>{ability}</div>;
}
