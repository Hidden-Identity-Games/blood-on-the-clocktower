import {
  Alignment,
  PlayerMessageMap,
  Reveal,
  Role,
} from "@hidden-identity/server";
import { useDefiniteGame } from "../../../store/GameContext";
import { useState } from "react";
import { Flex, Heading } from "@radix-ui/themes";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { Restrictions } from "./Restrictions";
import { AlignmentSelect, RoleSelectList } from "../Selectors";
import { getDefaultAlignment } from "../../../assets/game_data/gameData";
import { useCharacterRestriction } from "../Selectors/Restrictions";
import { useDynamicList } from "../Selectors/useDynamicList";

export interface RoleChangeMessageProps {
  message: PlayerMessageMap["role-change"];
  onOpenNote: (message: string, reveal: Record<string, Reveal[]>) => void;
}

export function RoleChangeMessage({
  message,
  onOpenNote,
}: RoleChangeMessageProps) {
  const { script } = useDefiniteGame();
  const [alignmentOverride, setAlignmentOverride] = useState<Alignment | null>(
    null,
  );
  const rolesList = script.map(({ id }) => id);

  const roleRilter = useCharacterRestriction(message.restriction);
  const rolesState = useDynamicList<Role>(rolesList, {
    recommended: rolesList.filter(roleRilter),
    defaultCount: 1,
  });

  return (
    <Flex direction="column" gap="2">
      <PlayerMessageLink
        className="mb-2"
        note={{
          reveal: {
            "You are now": [
              {
                character: rolesState.value[0],
                ...(message.alignmentChange && {
                  alignment:
                    alignmentOverride ||
                    getDefaultAlignment(rolesState.value[0]),
                }),
              },
            ],
          },
          message: "",
        }}
        onOpenNote={onOpenNote}
      />
      <Heading>Role</Heading>
      <Restrictions restrictions={message.restriction} />
      <RoleSelectList
        fixedSize
        roles={rolesState.value}
        addRole={rolesState.add}
        replaceRole={rolesState.replace}
      />
      <AlignmentSelect
        currentAlignment={
          alignmentOverride || getDefaultAlignment(rolesState.value[0])
        }
        onSelect={(alignment) => setAlignmentOverride(alignment)}
      />
    </Flex>
  );
}
