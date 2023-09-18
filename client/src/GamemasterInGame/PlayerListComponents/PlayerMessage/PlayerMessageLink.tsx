import { PlayerMessageScreenMessage } from "@hidden-identity/server";
import { Button } from "@radix-ui/themes";
import { useDefiniteGame } from "../../../store/GameContext";

export interface PlayerMessageLinkProps
  extends React.HTMLAttributes<HTMLAnchorElement> {
  note: PlayerMessageScreenMessage;
}
export function PlayerMessageLink({
  note,
  ...linkProps
}: PlayerMessageLinkProps) {
  const { gameId } = useDefiniteGame();
  return (
    <Button asChild>
      <a
        {...linkProps}
        href={`/${gameId}/note?playerMessage=${JSON.stringify(note)}`}
        target="_blank"
      >
        Go to note
      </a>
    </Button>
  );
}
