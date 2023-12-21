import { type UnifiedGame } from "@hidden-identity/shared";
import { getCharacter } from "@hidden-identity/shared";
import { Flex, Heading, Text } from "@radix-ui/themes";

import { useDefiniteGame } from "../../../store/GameContext";
import { PlayerStatusIcon } from "../../GMInGame/NotesIcons";
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
      <Text size="3" asChild>
        <Flex gap="1">
          {game.playerPlayerStatuses[player] && (
            <>
              Status:
              {game.playerPlayerStatuses[player]?.map((status) => (
                <PlayerStatusIcon
                  key={status.id}
                  statusType={status.type}
                  className="mt-.5"
                />
              ))}
            </>
          )}
        </Flex>
      </Text>
      {nightAbility ? (
        <Flex direction="column" gap="4">
          <Text as="div">{nightAbility.reminder}</Text>
          <NightAction nightData={nightAbility} />
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
