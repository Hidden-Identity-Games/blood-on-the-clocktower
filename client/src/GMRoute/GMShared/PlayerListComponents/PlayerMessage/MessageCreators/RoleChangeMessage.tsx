import {
  type Alignment,
  type CharacterActionQueueItem,
  type PlayerMessageCreatorMap,
  type Role,
} from "@hidden-identity/shared";
import { getDefaultAlignment } from "@hidden-identity/shared";
import { Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";

import { useDefiniteGame } from "../../../../../store/GameContext";
import { AlignmentSelect, RoleSelectList } from "../../Selectors";
import { useCharacterRestriction } from "../../Selectors/Restrictions";
import { useDynamicList } from "../../Selectors/useDynamicList";
import { Restrictions } from "../messageShared/Restrictions";
import { SubmitMessage } from "../messageShared/SubmitMessage";

export interface RoleChangeMessageProps {
  message: PlayerMessageCreatorMap["role-change"];
  action: CharacterActionQueueItem;
}

export function RoleChangeMessage({ message, action }: RoleChangeMessageProps) {
  const { player } = action;

  const { game } = useDefiniteGame();
  const { script } = game;
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
        player={player}
        currentAlignment={
          alignmentOverride || getDefaultAlignment(rolesState.value[0])
        }
        onSelect={(alignment) => setAlignmentOverride(alignment)}
      />
      <SubmitMessage
        action={action}
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
