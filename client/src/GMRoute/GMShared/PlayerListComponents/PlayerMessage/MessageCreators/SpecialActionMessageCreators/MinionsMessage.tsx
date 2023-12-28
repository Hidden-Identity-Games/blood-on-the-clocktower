import {
  getCharacter,
  type SpecialActionQueueItem,
} from "@hidden-identity/shared";
import { Heading, Text } from "@radix-ui/themes";

import { PlayerNameWithRoleIcon } from "../../../../../../shared/RoleIcon";
import { useDefiniteGame } from "../../../../../../store/GameContext";

interface MinionsMessagesProps {
  action: SpecialActionQueueItem;
}
export function MinionsMessages(_props: MinionsMessagesProps) {
  const { game } = useDefiniteGame();
  return (
    <>
      <Text>Wake up the minions, and show them who their demon is.</Text>
      <Heading>Minions:</Heading>
      <ul className="pl-2">
        {Object.entries(game.playersToRoles)
          .filter(([_, role]) => getCharacter(role).team === "Minion")
          .map(([player]) => (
            <li key={player}>
              <PlayerNameWithRoleIcon player={player} />
            </li>
          ))}
      </ul>
      <Heading>Demon:</Heading>
      <ul className="pl-2">
        {Object.entries(game.playersToRoles)
          .filter(([_, role]) => getCharacter(role).team === "Demon")
          .map(([player]) => (
            <li key={player}>
              <PlayerNameWithRoleIcon player={player} />
            </li>
          ))}
      </ul>
    </>
  );
}
