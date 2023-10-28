import { PlayerMessageMap } from "@hidden-identity/shared";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { Flex } from "@radix-ui/themes";
import { Reveal } from "../../../types/PlayerMessageScreen";

export interface RevivedMessageProps {
  message: PlayerMessageMap["revived"];
  onOpenNote: (message: string, reveal: Record<string, Reveal[]>) => void;
}

export function RevivedMessage({ onOpenNote }: RevivedMessageProps) {
  const text = "You have been revived!";

  return (
    <Flex direction="column" gap="2">
      <PlayerMessageLink
        className="mb-2"
        note={{
          message: text,
          reveal: {},
        }}
        onOpenNote={onOpenNote}
      />
    </Flex>
  );
}
