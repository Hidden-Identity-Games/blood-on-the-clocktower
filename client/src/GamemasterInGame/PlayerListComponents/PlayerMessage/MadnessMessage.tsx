import { Reveal, Role } from "@hidden-identity/server";
import { useState } from "react";
import { pluck } from "../../../utils/shuffleList";
import { useDefiniteGame } from "../../../store/GameContext";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { Flex } from "@radix-ui/themes";
import { RoleSelect } from "../Selectors";

export interface MadnessMessageProps {
  openMessageCallback?: (
    message: string,
    reveal: Record<string, Reveal[]>,
  ) => void;
}

export function MadnessMessage({ openMessageCallback }: MadnessMessageProps) {
  const { script } = useDefiniteGame();
  const [role, setRole] = useState<Role>(() =>
    pluck(script.map(({ id }) => id)),
  );

  const text =
    "You must make an effort to convince people you are this role or risk execution.";
  const reveal = {
    "You are mad as:": [{ character: role }],
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
      <RoleSelect
        currentRole={role}
        onSelect={(next) => next && setRole(next)}
      />
    </Flex>
  );
}
