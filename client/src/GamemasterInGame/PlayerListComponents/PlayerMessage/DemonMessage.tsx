import { Role } from "@hidden-identity/shared";
import { Flex, Heading } from "@radix-ui/themes";
import { useDefiniteGame } from "../../../store/GameContext";
import { PlayerMessageLink } from "./PlayerMessageLink";

import { PlayerSelectList, RoleSelectList } from "../Selectors";
import { useDynamicList } from "../Selectors/useDynamicList";
import {
  useCharacterRestriction,
  usePlayerRestrictions,
} from "../Selectors/Restrictions";
import { Reveal } from "../../../types/PlayerMessageScreen";

export interface DemonMessageProps {
  onOpenNote: (message: string, reveal: Record<string, Reveal[]>) => void;
}
export function DemonMessage({ onOpenNote }: DemonMessageProps) {
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

  const minionFilter = usePlayerRestrictions({ team: ["Minion"] });
  const minions = game.playerList.filter(minionFilter);
  const minionsState = useDynamicList<string>(game.playerList, {
    recommended: minions,
    defaultCount: minions.length,
  });

  return (
    <Flex direction="column" gap="2">
      <PlayerMessageLink
        className="mb-2"
        note={{
          reveal: {
            minions: minionsState.value.map((minion) => ({ player: minion })),
            bluffs: bluffsState.value.map((bluff) => ({
              character: bluff,
            })),
          },
          message: "",
        }}
        onOpenNote={onOpenNote}
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
    </Flex>
  );
}
