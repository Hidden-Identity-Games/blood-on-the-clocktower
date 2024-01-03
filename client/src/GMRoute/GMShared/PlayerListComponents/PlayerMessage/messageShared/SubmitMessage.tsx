import { Button } from "@design-system/components/button";
import {
  type ActionQueueItem,
  type PlayerMessageEntry,
} from "@hidden-identity/shared";

import { ErrorCallout } from "../../../../../shared/ErrorCallout";
import { useCreateMessage } from "../../../../../store/actions/gmActions";
import { useSheetView } from "../../../../../store/url";

export interface SubmitMessageProps {
  message?: PlayerMessageEntry[];
  player: string;
  action?: ActionQueueItem;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}
export function SubmitMessage({
  message = [],
  player,
  onClick,
}: SubmitMessageProps) {
  const [createMessageError, createMessageisLoading, messageId, createMessage] =
    useCreateMessage();
  const [_, setSheetView] = useSheetView();

  return (
    <>
      <ErrorCallout error={createMessageError} />
      {(!messageId || messageId) && (
        <Button
          variant="secondary"
          className={"w-full"}
          disabled={createMessageisLoading && message.length === 0}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async (e) => {
            const messageId = await createMessage(player, message);
            if (messageId) {
              void setSheetView({
                type: "message",
                id: messageId,
                isOpen: "open",
              });
            }
            onClick?.(e);
          }}
        >
          {createMessageisLoading ? (
            <span className="spin-in" />
          ) : (
            "Create message"
          )}
        </Button>
      )}
    </>
  );
}
