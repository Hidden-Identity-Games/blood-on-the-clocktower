import { UnifiedGame } from "@hidden-identity/server";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { getCharacter } from "../../assets/game_data/gameData";
import { useDefiniteGame } from "../../store/GameContext";
import { PlayerMessageFlow } from "./PlayerMessage";

type AbilityKey = "firstNight" | "otherNight";

function getAbilityKey(game: UnifiedGame): AbilityKey {
  return game.gameStatus === "Setup" ? "firstNight" : "otherNight";
}

export function PlayerNightReminder({ player }: { player: string }) {
  const { game } = useDefiniteGame();
  const character = getCharacter(game.playersToRoles[player]);
  const abilityKey = getAbilityKey(game);
  const nightAbility = character[abilityKey];

  return (
    <Flex direction="column" gap="2">
      {nightAbility ? (
        <>
          <Text as="div">{nightAbility.reminder}</Text>

          {nightAbility.playerMessage && (
            <PlayerMessageFlow
              message={nightAbility.playerMessage}
              player={player}
            />
          )}
        </>
      ) : (
        <>
          <Heading>DOES NOT ACT TONIGHT</Heading>
          <Text as="div">{character.ability}</Text>
        </>
      )}
    </Flex>
  );
}
