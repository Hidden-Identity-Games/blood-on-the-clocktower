import { PlayerMessageMap, Role } from "@hidden-identity/server";
import { useDefiniteGame } from "../../../store/GameContext";
import { useState } from "react";
import { pluck } from "../../../utils/shuffleList";
import { Flex, Heading } from "@radix-ui/themes";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { Restrictions } from "./Restrictions";
import { RoleSelect, getAlignment } from "../Selectors";
import { getCharacter } from "../../../assets/game_data/gameData";

export interface RoleChangeMessageProps {
  message: PlayerMessageMap["role-change"];
}

export function RoleChangeMessage({ message }: RoleChangeMessageProps) {
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
            "You are now": [
              {
                character: role,
                team: getAlignment(getCharacter(role).team),
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
