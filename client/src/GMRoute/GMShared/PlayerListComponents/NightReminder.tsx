import { getCharacter } from "@hidden-identity/shared";
import { Flex, Text } from "@radix-ui/themes";

import { useDefiniteGame } from "../../../store/GameContext";

interface PlayerNightReminderProps {
  player: string;
}
export function PlayerNightReminder({ player }: PlayerNightReminderProps) {
  const { game } = useDefiniteGame();
  const character = getCharacter(game.playersToRoles[player]);

  return (
    <Flex direction="column" gap="2">
      <Text as="div">{character.ability}</Text>
    </Flex>
  );
}
