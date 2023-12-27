import {
  type CharacterActionQueueItem,
  type PlayerMessageCreatorMap,
  type Role,
} from "@hidden-identity/shared";
import { Flex, Heading, TextFieldInput } from "@radix-ui/themes";
import { useState } from "react";

import { useDefiniteGame } from "../../../../../store/GameContext";
import { RoleSelectList } from "../../Selectors";
import { useCharacterRestriction } from "../../Selectors/Restrictions";
import { useDynamicList } from "../../Selectors/useDynamicList";
import { Restrictions } from "../messageShared/Restrictions";
import { SubmitMessage } from "../messageShared/SubmitMessage";

interface CharacterSelectedYouMessageProps {
  message: PlayerMessageCreatorMap["character-selected-you"];
  action: CharacterActionQueueItem;
}

export function CharacterSelectedYouMessage({
  message,
  action,
}: CharacterSelectedYouMessageProps) {
  const { player } = action;
  const { script } = useDefiniteGame();
  const [groupName, setGroupName] = useState("In play");
  const rolesList = script.map(({ id }) => id);

  const filter = useCharacterRestriction(message.restriction);
  const rolesState = useDynamicList<Role>(rolesList, {
    recommended: rolesList.filter(filter),
    defaultCount: 1,
  });

  return (
    <Flex direction="column" gap="2">
      <Heading>Role</Heading>
      <Restrictions restrictions={message.restriction} />
      <TextFieldInput
        onChange={(e) => setGroupName(e.target.value)}
        value={groupName}
      />
      <RoleSelectList
        roles={rolesState.value}
        addRole={rolesState.add}
        replaceRole={rolesState.replace}
      />
      <SubmitMessage
        action={action}
        player={player}
        message={rolesState.value.map((k) => ({
          character: k,
          group: groupName,
        }))}
      />
    </Flex>
  );
}
