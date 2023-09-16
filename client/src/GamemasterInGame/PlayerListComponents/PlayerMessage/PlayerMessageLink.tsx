import { PlayerMessageScreenMessage } from "@hidden-identity/server";
import { Button } from "@radix-ui/themes";

export interface PlayerMessageLinkProps
  extends React.HTMLAttributes<HTMLAnchorElement> {
  gameId: string;
  note: PlayerMessageScreenMessage;
}
export function PlayerMessageLink({
  note,
  gameId,
  ...linkProps
}: PlayerMessageLinkProps) {
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
