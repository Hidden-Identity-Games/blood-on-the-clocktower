import { PlayerMessageMap, Reveal, Role } from "@hidden-identity/server";
import { useDefiniteGame } from "../../../store/GameContext";
import { useState } from "react";
import { pluck } from "../../../utils/shuffleList";
import { Flex, Heading } from "@radix-ui/themes";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { Restrictions } from "./Restrictions";
import { RoleSelect } from "../Selectors";
import { getDefaultAlignment } from "../../../assets/game_data/gameData";

export interface RoleChangeMessageProps {
  message: PlayerMessageMap["role-change"];
  openMessageCallback?: (
    message: string,
    reveal: Record<string, Reveal[]>,
  ) => void;
}

export function RoleChangeMessage({
  message,
  openMessageCallback,
}: RoleChangeMessageProps) {
  const { script } = useDefiniteGame();
  const [role, setRole] = useState<Role>(() =>
    pluck(script.map(({ id }) => id)),
  );

  const text = "";
  const reveal = {
    "You are now": [
      {
        character: role,
        ...(message.alignmentChange && {
          alignment: getDefaultAlignment(role),
        }),
      },
    ],
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
      <Heading>Role</Heading>
      <Restrictions restrictions={message.restriction} />
      <RoleSelect
        currentRole={role}
        onSelect={(next) => next && setRole(next)}
      />
    </Flex>
  );
}
