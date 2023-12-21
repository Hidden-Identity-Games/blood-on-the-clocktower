import { Role } from "@hidden-identity/shared";
import { Dialog, Flex, Heading } from "@radix-ui/themes";
import { useDefiniteGame } from "../../../../../store/GameContext";

import { PlayerSelectList, RoleSelectList } from "../../Selectors";
import { useDynamicList } from "../../Selectors/useDynamicList";
import {
  useCharacterRestriction,
  usePlayerRestrictions,
} from "../../Selectors/Restrictions";
import { SubmitMessage } from "../messageShared/SubmitMessage";

export interface DemonMessageProps {
  player: string;
}
export function DemonMessage({ player }: DemonMessageProps) {
  const { game, script } = useDefiniteGame();
  const rolesList = script.map(({ id }) => id);

  const bluffsFilter = useCharacterRestriction({
    team: ["Townsfolk", "Outsider"],
    inPlay: false,
  });
  const bluffsState = useDynamicList<Role>(rolesList, {
    recommended: rolesList.filter(bluffsFilter),
    defaultCount: 3,
  });
  const bluffMessages = bluffsState.value.map((bluff) => ({
    character: bluff,
    group: "Your bluffs",
  }));

  const minionFilter = usePlayerRestrictions({ team: ["Minion"] });
  const minions = game.playerList.filter(minionFilter);
  const minionsState = useDynamicList<string>(game.playerList, {
    recommended: minions,
    defaultCount: minions.length,
  });
  const minionMessages = minionsState.value.map((minion) => ({
    player: minion,
    group: "Your minions",
  }));

  return (
    <Flex direction="column" gap="2">
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
      {/* We're still in a dialog :-/ this is a hack */}
      <Dialog.Close>
        <SubmitMessage
          player={player}
          message={[...bluffMessages, ...minionMessages]}
        />
      </Dialog.Close>
    </Flex>
  );
}
