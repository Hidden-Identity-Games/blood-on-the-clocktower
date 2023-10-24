import { PlayerMessageScreenMessage } from "@hidden-identity/server";
import { Button, Dialog } from "@radix-ui/themes";
import { useDefiniteGame } from "../../../store/GameContext";

export interface PlayerMessageLinkProps
  extends React.HTMLAttributes<HTMLAnchorElement> {
  note: PlayerMessageScreenMessage;
  callback?: () => void;
}
export function PlayerMessageLink({
  note,
  callback,
  ...linkProps
}: PlayerMessageLinkProps) {
  const { gameId } = useDefiniteGame();
  return callback ? (
    <Dialog.Close>
      <Button onClick={callback}>Go to note</Button>
    </Dialog.Close>
  ) : (
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
