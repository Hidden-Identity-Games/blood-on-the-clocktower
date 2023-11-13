import { ComponentProps } from "react";
import {
  PlayerMessageScreenMessage,
  Reveal,
} from "../../../types/PlayerMessageScreen";
import { Button, Dialog } from "@radix-ui/themes";

export interface PlayerMessageLinkProps extends ComponentProps<typeof Button> {
  note: PlayerMessageScreenMessage;
  onOpenNote: (message: string, reveal: Record<string, Reveal[]>) => void;
}
export function PlayerMessageLink({
  note,
  onOpenNote,
  ...buttonProps
}: PlayerMessageLinkProps) {
  return (
    <Dialog.Close>
      <Button
        {...buttonProps}
        onClick={() => onOpenNote(note.message, note.reveal)}
      >
        Go to note
      </Button>
    </Dialog.Close>
  );
}
