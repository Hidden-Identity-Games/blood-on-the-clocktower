import { PlayerMessageMap, Reveal, Role } from "@hidden-identity/server";
import { pluck } from "../../../utils/shuffleList";
import { RoleSelect } from "../Selectors";
import { Restrictions } from "./Restrictions";
import { Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { useDefiniteGame } from "../../../store/GameContext";

interface CharacterSelectedYouMessageProps {
  message: PlayerMessageMap["character-selected-you"];
  openMessageCallback?: (
    message: string,
    reveal: Record<string, Reveal[]>,
  ) => void;
}

export function CharacterSelectedYouMessage({
  message,
  openMessageCallback,
}: CharacterSelectedYouMessageProps) {
  const { script } = useDefiniteGame();
  const [role, setRole] = useState<Role>(() =>
    pluck(script.map(({ id }) => id)),
  );

  const text = "";
  const reveal = {
    "In play": [
      {
        character: role,
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
