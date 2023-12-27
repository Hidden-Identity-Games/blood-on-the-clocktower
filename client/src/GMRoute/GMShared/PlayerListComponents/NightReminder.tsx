import { type UnifiedGame } from "@hidden-identity/shared";
import { getCharacter } from "@hidden-identity/shared";
import { Flex, Heading, Text } from "@radix-ui/themes";

import { useDefiniteGame } from "../../../store/GameContext";
import { PlayerList } from ".";
import { NightAction } from "./NightAction";

type AbilityKey = "firstNight" | "otherNight";

function getAbilityKey(game: UnifiedGame): AbilityKey {
  return game.gameStatus === "Setup" ? "firstNight" : "otherNight";
}

interface PlayerNightReminderProps {
  player: string;
}
export function PlayerNightReminder({ player }: PlayerNightReminderProps) {
  const { game } = useDefiniteGame();
  const character = getCharacter(game.playersToRoles[player]);
  const abilityKey = getAbilityKey(game);
  const nightAbility = character[abilityKey];

  return (
    <Flex direction="column" gap="2">
      {nightAbility ? (
        <Flex direction="column" gap="4">
          <Text as="div">{nightAbility.reminder}</Text>
          <NightAction />
          {nightAbility.playerMessage && (
            <PlayerList.PlayerMessage
              message={nightAbility.playerMessage}
              player={player}
            />
          )}
        </Flex>
      ) : (
        <>
          <Heading>DOES NOT ACT TONIGHT</Heading>
          <Text as="div">{character.ability}</Text>
        </>
      )}
    </Flex>
  );
}
