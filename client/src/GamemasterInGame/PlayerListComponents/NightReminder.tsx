import { UnifiedGame } from "@hidden-identity/server";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { getCharacter } from "../../assets/game_data/gameData";
import { useDefiniteGame } from "../../store/GameContext";
import { PlayerList } from ".";
import { NightAction } from "./NightAction";
import { PlayerStatusIcon } from "../NotesIcons";

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
      <Text size="5" asChild>
        <Flex gap="1" align="center">
          {game.playerPlayerStatuses[player] && (
            <>
              Status:
              {game.playerPlayerStatuses[player]?.map((status) => (
                <PlayerStatusIcon statusType={status.type} />
              ))}
            </>
          )}
        </Flex>
      </Text>
      {nightAbility ? (
        <>
          <Text as="div">{nightAbility.reminder}</Text>
          <NightAction nightData={nightAbility} />
          {nightAbility.playerMessage && (
            <PlayerList.PlayerMessage
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
