import { PlayerMessageMap, Role } from "@hidden-identity/shared";
import { useDefiniteGame } from "../../../store/GameContext";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { Flex, Heading } from "@radix-ui/themes";
import { useMemo } from "react";
import { Restrictions } from "./Restrictions";
import { PlayerSelectList, RoleSelectList } from "../Selectors";
import { useDynamicList } from "../Selectors/useDynamicList";
import {
  useCharacterRestriction,
  usePlayerRestrictions,
} from "../Selectors/Restrictions";
import { Reveal } from "../../../types/PlayerMessageScreen";

interface RevealPlayerMessageProps {
  message: PlayerMessageMap["reveal-player"];
  player: string;
  onOpenNote: (message: string, reveal: Record<string, Reveal[]>) => void;
}

export function RevealPlayerMessage({
  message,
  player,
  onOpenNote,
}: RevealPlayerMessageProps) {
  const { restriction } = message;

  const filter = useCharacterRestriction(restriction);
  const { game, script } = useDefiniteGame();

  const playerFilter = usePlayerRestrictions({
    ...message.restriction,
  });

  const playersState = useDynamicList<string>(game.playerList, {
    recommended: game.playerList
      .filter((p) => p !== player)
      .filter(playerFilter),
    defaultCount: message.count,
  });

  const rolesList = useMemo(() => script.map(({ id }) => id), [script]);
  const roleState = useDynamicList<Role>(rolesList, {
    recommended: rolesList.filter(filter),
    // FIX
    mustInclude: [game.playersToRoles[playersState.value[0]]],
    defaultCount: message.count,
  });

  return (
    <Flex direction="column" gap="2">
      <Heading>Player</Heading>
      <Restrictions restrictions={message.restriction} />
      <PlayerSelectList
        players={playersState.value}
        addPlayer={playersState.add}
        replacePlayer={playersState.replace}
      />

      <RoleSelectList
        roles={roleState.value}
        addRole={roleState.add}
        replaceRole={roleState.replace}
      />
      <PlayerMessageLink
        className="mt-2"
        note={{
          reveal: {
            Reveal: roleState.value.map((potentialRole) => ({
              character: potentialRole,
              player: playersState.value[0],
            })),
          },
          message: "",
        }}
        onOpenNote={onOpenNote}
      />
    </Flex>
  );
}
