import {
  type ActionQueueItem,
  type PlayerMessageEntry,
} from "@hidden-identity/shared";
import { Button } from "@radix-ui/themes";

import { ErrorCallout } from "../../../../../shared/ErrorCallout";
import {
  useCompleteAction,
  useCreateMessage,
} from "../../../../../store/actions/gmActions";
import { useSheetView } from "../../../../../store/url";

export interface SubmitMessageProps {
  message: PlayerMessageEntry[];
  player: string;
  action: ActionQueueItem;
}
export function SubmitMessage({ message, player, action }: SubmitMessageProps) {
  const [createMessageError, createMessageisLoading, messageId, createMessage] =
    useCreateMessage();
  const [_, setSheetView] = useSheetView();
  const [, , , completeAction] = useCompleteAction();

  return (
    <>
      <ErrorCallout error={createMessageError} />
      {!messageId && (
        <Button
          disabled={createMessageisLoading && message.length === 0}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async () => {
            const messageId = await createMessage(player, message);
            await completeAction(action.id);
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
