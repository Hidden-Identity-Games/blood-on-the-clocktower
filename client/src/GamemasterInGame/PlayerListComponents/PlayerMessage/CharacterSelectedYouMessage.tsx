import { PlayerMessageMap, Role } from "@hidden-identity/shared";
import { RoleSelectList } from "../Selectors";
import { Restrictions } from "./Restrictions";
import { Flex, Heading } from "@radix-ui/themes";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { useDefiniteGame } from "../../../store/GameContext";
import { useCharacterRestriction } from "../Selectors/Restrictions";
import { useDynamicList } from "../Selectors/useDynamicList";
import { Reveal } from "../../../types/PlayerMessageScreen";

interface CharacterSelectedYouMessageProps {
  message: PlayerMessageMap["character-selected-you"];
  onOpenNote: (message: string, reveal: Record<string, Reveal[]>) => void;
}

export function CharacterSelectedYouMessage({
  message,
  onOpenNote,
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
      <PlayerMessageLink
        className="mb-2"
        note={{
          reveal: {
            "In play": rolesState.value.map((k) => ({ character: k })),
          },
          message: "",
        }}
        onOpenNote={onOpenNote}
      />
      <Heading>Role</Heading>
      <Restrictions restrictions={message.restriction} />
      <RoleSelectList
        roles={rolesState.value}
        addRole={rolesState.add}
        replaceRole={rolesState.replace}
      />
    </Flex>
  );
}
