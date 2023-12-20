import { PlayerMessageCreatorMap, Role } from "@hidden-identity/shared";
import { RoleSelectList } from "../../Selectors";
import { Restrictions } from "../messageShared/Restrictions";
import { Flex, Heading } from "@radix-ui/themes";
import { useDefiniteGame } from "../../../../store/GameContext";
import { useCharacterRestriction } from "../../Selectors/Restrictions";
import { useDynamicList } from "../../Selectors/useDynamicList";
import { SubmitMessage } from "../messageShared/SubmitMessage";

interface CharacterSelectedYouMessageProps {
  message: PlayerMessageCreatorMap["character-selected-you"];
  player: string;
}

export function CharacterSelectedYouMessage({
  message,
  player,
}: CharacterSelectedYouMessageProps) {
  const { script } = useDefiniteGame();
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
      <RoleSelectList
        roles={rolesState.value}
        addRole={rolesState.add}
        replaceRole={rolesState.replace}
      />
      <SubmitMessage
        player={player}
        message={rolesState.value.map((k) => ({
          character: k,
          group: "In play",
        }))}
      />
    </Flex>
  );
}
