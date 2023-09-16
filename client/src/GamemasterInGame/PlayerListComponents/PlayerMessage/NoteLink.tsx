import { NotesScreenNote } from "@hidden-identity/server";
import { Button } from "@radix-ui/themes";

export interface NoteLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  gameId: string;
  note: NotesScreenNote;
}
export function NoteLink({ note, gameId, ...linkProps }: NoteLinkProps) {
  return (
    <Button asChild>
      <a
        {...linkProps}
        href={`/${gameId}/note?playerMessage=${JSON.stringify(note)}`}
        target="player_note"
      >
        Go to note
      </a>
    </Button>
  );
}
