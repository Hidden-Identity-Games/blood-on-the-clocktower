import { PlayerMessageMap, Role } from "@hidden-identity/server";
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
}

export function RevealPlayerMessage({
  message,
  player,
}: RevealPlayerMessageProps) {
  const { game, script } = useDefiniteGame();
  const [playerToReveal, setPlayerToReveal] = useState<string>(() =>
    pluck(game.playerList.filter((p) => p !== player)),
  );
  const rolesList = useMemo(() => script.map(({ id }) => id), []);
  const roleState = useDynamicList<Role>(rolesList, {
    recommended: rolesList,
    // FIX
    mustInclude: [game.playersToRoles[playerToReveal]],
    defaultCount: message.count,
  });

  return (
    <Flex direction="column" gap="2">
      <PlayerMessageLink
        className="mb-2"
        note={{
          reveal: {
            Reveal: roleState.value.map((potentialRole) => ({
              character: potentialRole,
              player: playerToReveal,
            })),
          },
          message: "",
        }}
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
