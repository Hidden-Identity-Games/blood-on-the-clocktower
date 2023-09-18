import { Role } from "@hidden-identity/server";
import { useState } from "react";
import { pluck } from "../../../utils/shuffleList";
import { useDefiniteGame } from "../../../store/GameContext";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { Flex } from "@radix-ui/themes";
import { RoleSelect } from "../Selectors";

export interface MadnessMessageProps {}

export function MadnessMessage(_props: MadnessMessageProps) {
  const { script } = useDefiniteGame();
  const [role, setRole] = useState<Role>(() =>
    pluck(script.map(({ id }) => id)),
  );

  return (
    <Flex direction="column" gap="2">
      <PlayerMessageLink
        className="mb-2"
        note={{
          reveal: {
            "You are mad as:": [{ character: role }],
          },
          message:
            "You must make an effort to convince people you are this role or risk execution.",
        }}
      />
      <RoleSelect
        currentRole={role}
        onSelect={(next) => next && setRole(next)}
      />
    </Flex>
  );
}
