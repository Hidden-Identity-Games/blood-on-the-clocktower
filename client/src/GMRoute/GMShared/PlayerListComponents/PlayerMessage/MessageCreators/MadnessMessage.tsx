import { PlayerMessageCreatorMap, Role } from "@hidden-identity/shared";
import { Flex } from "@radix-ui/themes";

import { useDefiniteGame } from "../../../../../store/GameContext";
import { RoleSelectList } from "../../Selectors";
import { useDynamicList } from "../../Selectors/useDynamicList";
import { SubmitMessage } from "../messageShared/SubmitMessage";

export interface MadnessMessageProps {
  message: PlayerMessageCreatorMap["madness"];
  player: string;
}

export function MadnessMessage({ player }: MadnessMessageProps) {
  const { script } = useDefiniteGame();

  const rolesList = script.map(({ id }) => id);

  const rolesState = useDynamicList<Role>(rolesList, {
    recommended: rolesList,
    defaultCount: 1,
  });

  return (
    <Flex direction="column" gap="2">
      <RoleSelectList
        roles={rolesState.value}
        addRole={rolesState.add}
        replaceRole={rolesState.replace}
      />
      <SubmitMessage
        player={player}
        message={[
          { group: "You are mad as:", character: rolesState.value[0] },
          {
            message:
              "You must make an effort to convince people you are this role or risk execution.  Even in private",
            group: "IMPORTANT",
          },
        ]}
      />
    </Flex>
  );
}
