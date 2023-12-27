import {
  type CharacterActionQueueItem,
  type PlayerMessageCreatorMap,
} from "@hidden-identity/shared";
import { Flex } from "@radix-ui/themes";

import { SubmitMessage } from "../messageShared/SubmitMessage";

export interface RevivedMessageProps {
  message: PlayerMessageCreatorMap["revived"];
  action: CharacterActionQueueItem;
}

export function RevivedMessage({ action }: RevivedMessageProps) {
  const { player } = action;

  return (
    <Flex direction="column" gap="2">
      <SubmitMessage
        action={action}
        player={player}
        message={[{ group: "Yay!", message: "You have been revived" }]}
      />
    </Flex>
  );
}
