import { PlayerMessageMap } from "@hidden-identity/server";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { Flex } from "@radix-ui/themes";

export interface RevivedMessageProps {
  message: PlayerMessageMap["revived"];
}

export function RevivedMessage(_props: RevivedMessageProps) {
  return (
    <Flex direction="column" gap="2">
      <PlayerMessageLink
        className="mb-2"
        note={{
          message: "You have been revived!",
        }}
      />
    </Flex>
  );
}
