import { PlayerMessageMap, Role } from "@hidden-identity/server";
import { useDefiniteGame } from "../../../store/GameContext";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { pluck } from "../../../utils/shuffleList";
import { Restrictions } from "./Restrictions";
import { PlayerSelectList, RoleSelect } from "../Selectors";
import { useDynamicList } from "../Selectors/useDynamicList";

export interface RevealRoleMessageProps {
  message: PlayerMessageMap["reveal-role"];
  player: string;
}
export function RevealRoleMessage({ message, player }: RevealRoleMessageProps) {
  const { game, gameId, script } = useDefiniteGame();
  const [role, setRole] = useState<Role>(() =>
    pluck(
      script
        .map(({ id }) => id)
        .filter((role) => role !== game.playersToRoles[player]),
    ),
  );
  const playersState = useDynamicList<string>(game.playerList, {
    recommended: game.playerList.filter((p) => player !== p),
    mustInclude: game.playerList.filter((p) => game.playersToRoles[p] === role),
    defaultCount: message.count,
  });

  return (
    <Flex direction="column" gap="2">
      <PlayerMessageLink
        className="mb-2"
        note={{
          reveal: {
            Reveal: playersState.value.map((p) => ({
              character: role ?? undefined,
              player: p,
            })),
          },
          message: "",
        }}
        gameId={gameId}
      />
      <Heading>Role</Heading>
      <Restrictions restrictions={message.restriction} />
      <RoleSelect
        currentRole={role}
        onSelect={(nextRole) => nextRole && setRole(nextRole)}
      />

      <PlayerSelectList
        players={playersState.value}
        addPlayer={playersState.add}
        replacePlayer={playersState.replace}
      />
    </Flex>
  );
}
