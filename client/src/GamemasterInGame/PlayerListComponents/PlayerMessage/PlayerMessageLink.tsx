import { ComponentProps } from "react";
import {
  PlayerMessageScreenMessage,
  Reveal,
} from "../../../types/PlayerMessageScreen";
import { Button } from "@radix-ui/themes";
import { SheetCollapse } from "../../../shared/Sheet/SheetBody";

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
    <SheetCollapse>
      <Button
        {...buttonProps}
        onClick={() => onOpenNote(note.message, note.reveal)}
      >
        Go to note
      </Button>
    </SheetCollapse>
  );
}
