import {
  Alignment,
  PlayerMessageCreatorMap,
  Role,
} from "@hidden-identity/shared";
import { useDefiniteGame } from "../../../../store/GameContext";
import { useState } from "react";
import { Flex, Heading } from "@radix-ui/themes";
import { Restrictions } from "../messageShared/Restrictions";
import { AlignmentSelect, RoleSelectList } from "../../Selectors";
import { getDefaultAlignment } from "@hidden-identity/shared";
import { useCharacterRestriction } from "../../Selectors/Restrictions";
import { useDynamicList } from "../../Selectors/useDynamicList";
import { SubmitMessage } from "../messageShared/SubmitMessage";

export interface RoleChangeMessageProps {
  message: PlayerMessageCreatorMap["role-change"];
  player: string;
}

export function RoleChangeMessage({ message, player }: RoleChangeMessageProps) {
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
      <SubmitMessage
        player={player}
        message={[
          {
            group: "You are now",
            character: rolesState.value[0],
            ...(message.alignmentChange && {
              alignment:
                alignmentOverride || getDefaultAlignment(rolesState.value[0]),
            }),
          },
        ]}
      />
    </Flex>
  );
}