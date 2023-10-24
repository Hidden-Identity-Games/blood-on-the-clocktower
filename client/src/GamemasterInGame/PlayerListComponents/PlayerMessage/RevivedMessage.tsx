import { PlayerMessageMap, Reveal } from "@hidden-identity/server";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { Flex } from "@radix-ui/themes";

export interface RevivedMessageProps {
  message: PlayerMessageMap["revived"];
  openMessageCallback?: (
    message: string,
    reveal: Record<string, Reveal[]>,
  ) => void;
}

export function RevivedMessage({ openMessageCallback }: RevivedMessageProps) {
  const text = "You have been revived!";

  return (
    <Flex direction="column" gap="2">
      <PlayerMessageLink
        className="mb-2"
        note={{
          message: text,
        }}
        callback={
          openMessageCallback ? () => openMessageCallback(text, {}) : undefined
        }
      />
    </Flex>
  );
}
