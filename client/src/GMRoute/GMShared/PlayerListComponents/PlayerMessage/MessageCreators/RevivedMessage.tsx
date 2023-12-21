import { type PlayerMessageCreatorMap } from "@hidden-identity/shared";
import { Flex } from "@radix-ui/themes";

import { SubmitMessage } from "../messageShared/SubmitMessage";

export interface RevivedMessageProps {
  message: PlayerMessageCreatorMap["revived"];
  player: string;
}

export function RevivedMessage({ player }: RevivedMessageProps) {
  return (
    <Flex direction="column" gap="2">
      <SubmitMessage
        player={player}
        message={[{ group: "Yay!", message: "You have been revived" }]}
      />
    </Flex>
  );
}
