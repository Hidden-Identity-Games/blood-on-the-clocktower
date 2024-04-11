import {
  getCharacter,
  type SpecialActionQueueItem,
} from "@hidden-identity/shared";
import { Heading, Text } from "@radix-ui/themes";

import { PlayerNameWithRoleIcon } from "../../../../../../shared/RoleIcon";
import { useDefiniteGame } from "../../../../../../store/GameContext";
import { SubmitMessage } from "../../messageShared/SubmitMessage";

interface MinionsMessagesProps {
  action: SpecialActionQueueItem;
}
export function MinionsMessages({ action }: MinionsMessagesProps) {
  const { game } = useDefiniteGame();
  const minionList = game.playerList.filter(
    (player) => getCharacter(game.playersToRoles[player]).team === "Minion",
  );
  const demonList = game.playerList.filter(
    (player) => getCharacter(game.playersToRoles[player]).team === "Demon",
  );
  return (
    <>
      <Text>Wake up the minions, and show them who their demon is.</Text>
      <Heading>Minions:</Heading>
      <ul className="pl-2">
        {minionList.map((player) => (
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
      <SubmitMessage
        action={action}
        player={""}
        message={[
          ...minionList.map((player) => ({
            group: "Minions",
            team: "Minion" as const,
            player,
          })),
          ...demonList.map((player) => ({
            group: "Demon",
            team: "Demon" as const,
            player,
          })),
        ]}
      />
    </>
  );
}
