import { Button } from "@design-system/components/button";
import {
  type ActionQueueItem,
  type PlayerMessageEntry,
} from "@hidden-identity/shared";

import { ErrorCallout } from "../../../../../shared/ErrorCallout";
import { useCreateMessage } from "../../../../../store/actions/gmActions";
import { useSheetView } from "../../../../../store/url";

export interface SubmitMessageProps {
  message: PlayerMessageEntry[];
  player: string;
  action: ActionQueueItem;
}
export function SubmitMessage({ message, player }: SubmitMessageProps) {
  const [createMessageError, createMessageisLoading, messageId, createMessage] =
    useCreateMessage();
  const [_, setSheetView] = useSheetView();

  return (
    <>
      <ErrorCallout error={createMessageError} />
      {!messageId && (
        <Button
          className="w-full"
          disabled={createMessageisLoading && message.length === 0}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async () => {
            const messageId = await createMessage(player, message);
            if (messageId) {
              // make sure the request didn't fail
              void setSheetView({
                type: "message",
                id: messageId,
                isOpen: "open",
              });
            }
          }}
        >
          {createMessageisLoading ? "Redirecting to message" : "Create message"}
        </Button>
      )}
    </>
  );
}
