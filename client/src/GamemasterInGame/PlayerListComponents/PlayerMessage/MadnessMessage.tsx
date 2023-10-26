import { PlayerMessageMap, Reveal, Role } from "@hidden-identity/server";
import { useDefiniteGame } from "../../../store/GameContext";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { Flex } from "@radix-ui/themes";
import { RoleSelectList } from "../Selectors";
import { useDynamicList } from "../Selectors/useDynamicList";

export interface MadnessMessageProps {
  onOpenNote: (message: string, reveal: Record<string, Reveal[]>) => void;
  message: PlayerMessageMap["madness"];
}

export function MadnessMessage({ onOpenNote }: MadnessMessageProps) {
  const { script } = useDefiniteGame();

  const rolesList = script.map(({ id }) => id);

  const rolesState = useDynamicList<Role>(rolesList, {
    recommended: rolesList,
    defaultCount: 1,
  });

  return (
    <Flex direction="column" gap="2">
      <PlayerMessageLink
        className="mb-2"
        note={{
          reveal: {
            "You are mad as:": rolesState.value.map((character) => ({
              character,
            })),
          },
          message:
            "You must make an effort to convince people you are this role or risk execution.",
        }}
        onOpenNote={onOpenNote}
      />
      <RoleSelectList
        roles={rolesState.value}
        addRole={rolesState.add}
        replaceRole={rolesState.replace}
      />
    </Flex>
  );
}
