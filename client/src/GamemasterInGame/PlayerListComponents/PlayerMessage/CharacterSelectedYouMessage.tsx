import { PlayerMessageMap, Role } from "@hidden-identity/server";
import { pluck } from "../../../utils/shuffleList";
import { RoleSelect } from "../Selectors";
import { Restrictions } from "./Restrictions";
import { Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { useDefiniteGame } from "../../../store/GameContext";

interface CharacterSelectedYouMessageProps {
  message: PlayerMessageMap["character-selected-you"];
}

export function CharacterSelectedYouMessage({
  message,
}: CharacterSelectedYouMessageProps) {
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
            "In play": [
              {
                character: role,
              },
            ],
          },
          message: "",
        }}
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
