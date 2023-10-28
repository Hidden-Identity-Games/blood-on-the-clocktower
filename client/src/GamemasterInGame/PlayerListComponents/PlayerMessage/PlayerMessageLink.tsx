import {
  PlayerMessageScreenMessage,
  Reveal,
} from "../../../types/PlayerMessageScreen";
import { Button, Dialog } from "@radix-ui/themes";

export interface PlayerMessageLinkProps
  extends React.HTMLAttributes<HTMLAnchorElement> {
  note: PlayerMessageScreenMessage;
  onOpenNote: (message: string, reveal: Record<string, Reveal[]>) => void;
}
export function PlayerMessageLink({
  note,
  onOpenNote,
}: PlayerMessageLinkProps) {
  return (
    <Dialog.Close>
      <Button onClick={() => onOpenNote(note.message, note.reveal)}>
        Go to note
      </Button>
    </Dialog.Close>
  );
}
