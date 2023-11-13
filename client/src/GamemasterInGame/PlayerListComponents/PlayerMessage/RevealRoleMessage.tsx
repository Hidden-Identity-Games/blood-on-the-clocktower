import { PlayerMessageMap, Role } from "@hidden-identity/shared";
import { useDefiniteGame } from "../../../store/GameContext";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { Flex, Heading } from "@radix-ui/themes";

import { Restrictions } from "./Restrictions";
import { PlayerSelectList, RoleSelectList } from "../Selectors";
import { useDynamicList } from "../Selectors/useDynamicList";
import {
  useCharacterRestriction,
  usePlayerRestrictions,
} from "../Selectors/Restrictions";
import { Reveal } from "../../../types/PlayerMessageScreen";

export interface RevealRoleMessageProps {
  message: PlayerMessageMap["reveal-role"];
  player: string;
  onOpenNote: (message: string, reveal: Record<string, Reveal[]>) => void;
}
export function RevealRoleMessage({
  message,
  player,
  onOpenNote,
}: RevealRoleMessageProps) {
  const playerfilter = usePlayerRestrictions({
    ...message.restriction,
    inPlay: true,
  });
  const { game, script } = useDefiniteGame();

  const rolesList = script.map(({ id }) => id);

  const roleFilter = useCharacterRestriction(message.restriction);
  const rolesState = useDynamicList<Role>(rolesList, {
    recommended: rolesList.filter(roleFilter),
    defaultCount: 1,
  });

  const playersState = useDynamicList<string>(game.playerList, {
    recommended: game.playerList
      .filter((p) => player !== p)
      .filter(playerfilter),
    mustInclude: game.playerList.filter(
      (p) => game.playersToRoles[p] === rolesState.value[0],
    ),
    defaultCount: message.count,
  });

  return (
    <Flex direction="column" gap="2">
      <Heading>Role</Heading>
      <Restrictions restrictions={message.restriction} />
      <RoleSelectList
        fixedSize
        roles={rolesState.value}
        addRole={rolesState.add}
        replaceRole={rolesState.replace}
      />

      <PlayerSelectList
        players={playersState.value}
        addPlayer={playersState.add}
        replacePlayer={playersState.replace}
      />
      <PlayerMessageLink
        className="mt-2"
        note={{
          reveal: {
            Reveal: playersState.value.map((p) => ({
              character: rolesState.value[0] ?? undefined,
              player: p,
            })),
          },
          message: "",
        }}
        onOpenNote={onOpenNote}
      />
    </Flex>
  );
}
