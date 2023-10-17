import {
  Callout,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Link,
  Text,
} from "@radix-ui/themes";
import { useGame } from "../store/GameContext";
import { BsShare } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { Link as ReactRouterLink } from "react-router-dom";
import QRCode from "qrcode.react";

export function GameHeader() {
  const { gameId, game } = useGame();

  return (
    <>
      <Flex
        gap="2"
        justify="between"
        p="1"
        align="center"
        className="border-b-2 border-red-900"
      >
        <Flex gap="1" align="center">
          <QRCodeDialog gameId={gameId} />
        </Flex>
        <Heading size="2" className="shrink truncate capitalize">
          Status: {game?.gameStatus}
        </Heading>
      </Flex>
      {game?.nextGameId && (
        <Callout.Root>
          <Callout.Text>
            <Link asChild>
              <ReactRouterLink to={`/${game.nextGameId}`}>
                The storyteller has started a new game, click here to join.
              </ReactRouterLink>
            </Link>
          </Callout.Text>
        </Callout.Root>
      )}
    </>
  );
}

interface QRCodeDialogProps {
  gameId: string | null;
}
function QRCodeDialog({ gameId }: QRCodeDialogProps) {
  const url = `${document.location.protocol}//${document.location.hostname}${
    document.location.port ? `:${document.location.port}` : ""
  }/${gameId}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url, title: url, text: url });
      } catch (error) {
        console.error("Failed to share.");
      }
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Link onClick={handleShare} size="2" className="whitespace-nowrap">
          <Text color="amber">Game:</Text> {gameId}
          <BsShare className="ml-.5 inline text-xs" />
        </Link>
      </Dialog.Trigger>

      <Dialog.Content className="m-6">
        <Dialog.Title>
          <Flex align="center" justify="between">
            Scan to Join
            <Dialog.Close>
              <IconButton variant="surface">
                <AiOutlineClose />
              </IconButton>
            </Dialog.Close>
          </Flex>
        </Dialog.Title>

        <Flex mt="4" justify="center">
          <QRCode value={url} size={256} fgColor="darkred" />
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
