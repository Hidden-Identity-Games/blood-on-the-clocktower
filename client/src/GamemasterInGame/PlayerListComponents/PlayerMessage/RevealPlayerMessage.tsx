import { PlayerMessageMap, Reveal, Role } from "@hidden-identity/server";
import { useDefiniteGame } from "../../../store/GameContext";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { Flex, Heading } from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { pluck } from "../../../utils/shuffleList";
import { Restrictions } from "./Restrictions";
import { PlayerSelect, RoleSelectList } from "../Selectors";
import { useDynamicList } from "../Selectors/useDynamicList";

interface RevealPlayerMessageProps {
  message: PlayerMessageMap["reveal-player"];
  player: string;
  openMessageCallback?: (
    message: string,
    reveal: Record<string, Reveal[]>,
  ) => void;
}

export function RevealPlayerMessage({
  message,
  player,
  openMessageCallback,
}: RevealPlayerMessageProps) {
  const { game, script } = useDefiniteGame();
  const [playerToReveal, setPlayerToReveal] = useState<string>(() =>
    pluck(game.playerList.filter((p) => p !== player)),
  );
  const rolesList = useMemo(() => script.map(({ id }) => id), [script]);
  const roleState = useDynamicList<Role>(rolesList, {
    recommended: rolesList,
    // FIX
    mustInclude: [game.playersToRoles[playerToReveal]],
    defaultCount: message.count,
  });

  const text = "";
  const reveal = {
    Reveal: roleState.value.map((potentialRole) => ({
      character: potentialRole,
      player: playerToReveal,
    })),
  };

  return (
    <Flex direction="column" gap="2">
      <PlayerMessageLink
        className="mb-2"
        note={{
          reveal: reveal,
          message: text,
        }}
        callback={
          openMessageCallback
            ? () => openMessageCallback(text, reveal)
            : undefined
        }
      />
      <Heading>Player</Heading>
      <Restrictions restrictions={message.restriction} />
      <PlayerSelect
        currentPlayer={playerToReveal}
        onSelect={(nextPlayer) => nextPlayer && setPlayerToReveal(nextPlayer)}
      />

      <RoleSelectList
        roles={roleState.value}
        addRole={roleState.add}
        replaceRole={roleState.replace}
      />
    </Flex>
  );
}
