import { PlayerMessageEntry } from "@hidden-identity/shared";
import { ErrorCallout } from "../../../../shared/ErrorCallout";
import { Button, Text } from "@radix-ui/themes";
import { useCreateMessage } from "../../../../store/actions/gmActions";

export interface SubmitMessageProps {
  message: PlayerMessageEntry[];
  player: string;
}
export function SubmitMessage({ message, player }: SubmitMessageProps) {
  const [createMessageError, createMessageisLoading, messageId, createMessage] =
    useCreateMessage();

  return (
    <>
      <ErrorCallout error={createMessageError} />
      {!messageId && (
        <Button
          disabled={createMessageisLoading && message.length === 0}
          onClick={() => createMessage(player, message)}
        >
          Create message
        </Button>
      )}
      {messageId && <Text>We need to add a link here</Text>}
    </>
  );
}
