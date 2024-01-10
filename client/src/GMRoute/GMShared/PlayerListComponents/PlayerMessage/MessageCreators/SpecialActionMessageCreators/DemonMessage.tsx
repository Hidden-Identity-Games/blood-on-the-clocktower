import {
  type PlayerMessageEntry,
  type Role,
  type SpecialActionQueueItem,
} from "@hidden-identity/shared";
import { Flex, Heading } from "@radix-ui/themes";

import { useDefiniteGame } from "../../../../../../store/GameContext";
import { PlayerSelectList, RoleSelectList } from "../../../Selectors";
import {
  useCharacterRestriction,
  usePlayerRestrictions,
} from "../../../Selectors/Restrictions";
import { useDynamicList } from "../../../Selectors/useDynamicList";
import { SubmitMessage } from "../../messageShared/SubmitMessage";

export interface DemonMessageProps {
  action: SpecialActionQueueItem;
}
export function DemonMessage({ action }: DemonMessageProps) {
  const { game } = useDefiniteGame();
  const { script } = game;
  const rolesList = script.map(({ id }) => id);

  const demonFilter = usePlayerRestrictions({ team: ["Demon"] });
  const playerMessageIsFor = useDynamicList<string>(game.playerList, {
    recommended: action.player
      ? [action.player]
      : game.playerList.filter(demonFilter),
    defaultCount: 1,
  });

  const bluffsFilter = useCharacterRestriction({
    team: ["Townsfolk", "Outsider"],
    inPlay: false,
  });
  const bluffsState = useDynamicList<Role>(rolesList, {
    recommended: rolesList.filter(bluffsFilter),
    defaultCount: 3,
  });
  const bluffMessages: PlayerMessageEntry[] = bluffsState.value.map(
    (bluff) => ({
      character: bluff,
      group: "Your bluffs",
    }),
  );

  const minionFilter = usePlayerRestrictions({ team: ["Minion"] });
  const minions = game.playerList.filter(minionFilter);
  const minionsState = useDynamicList<string>(game.playerList, {
    recommended: minions,
    defaultCount: minions.length,
  });
  const minionMessages: PlayerMessageEntry[] = minionsState.value.map(
    (minion) => ({
      player: minion,
      group: "Your minions",
    }),
  );

  return (
    <Flex direction="column" gap="2">
      <Heading>For player:</Heading>
      <PlayerSelectList
        players={playerMessageIsFor.value}
        addPlayer={playerMessageIsFor.add}
        replacePlayer={playerMessageIsFor.replace}
      />
      <Heading>Minions:</Heading>
      <PlayerSelectList
        players={minionsState.value}
        addPlayer={minionsState.add}
        replacePlayer={minionsState.replace}
      />
      <Heading>Bluffs:</Heading>
      <RoleSelectList
        roles={bluffsState.value}
        addRole={bluffsState.add}
        replaceRole={bluffsState.replace}
      />
      <SubmitMessage
        action={action}
        player={playerMessageIsFor.value[0]}
        message={[...bluffMessages, ...minionMessages]}
      />
    </Flex>
  );
}
