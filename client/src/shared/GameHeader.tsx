import {
  Button,
  Callout,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Link,
  Text,
} from "@radix-ui/themes";
import QRCode from "qrcode.react";
import { AiOutlineClose } from "react-icons/ai";
import { BsShare } from "react-icons/bs";
import { Link as ReactRouterLink } from "react-router-dom";

import { useGame } from "../store/GameContext";
import { urlFromOrigin } from "../store/url";

export function GameHeader() {
  const { gameId, game } = useGame();
  if (!gameId) {
    return null;
  }

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
        <Heading size="2" className="max-w-[50%] shrink truncate capitalize">
          Status: {game?.gameStatus}
        </Heading>
      </Flex>
      {game?.nextGameId && (
        <Callout.Root>
          <Callout.Text>
            <Link asChild>
              <ReactRouterLink
                to={urlFromOrigin("game", { gameId: game.nextGameId })}
              >
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
  gameId: string;
}
function QRCodeDialog({ gameId }: QRCodeDialogProps) {
  const url = urlFromOrigin("game", { gameId: gameId });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url, title: "Join Game", text: url });
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
        <Flex align="center" gap="1" asChild>
          <button>
            <Text color="amber">Game:</Text>
            <Text className="truncate">{gameId}</Text>
            <BsShare className="text-sm" />
          </button>
        </Flex>
      </Dialog.Trigger>

      <Dialog.Content className="m-6">
        <Dialog.Title>
          <Flex align="center" justify="between">
            Scan to Join
            <Dialog.Close>
              <IconButton variant="ghost" radius="full">
                <AiOutlineClose />
              </IconButton>
            </Dialog.Close>
          </Flex>
        </Dialog.Title>

        <Flex mt="4" direction="column" justify="center" align="center" gap="5">
          <div className="bg-white p-1">
            <QRCode value={url} size={256} fgColor="darkred" />
          </div>
          <Button className="w-full" onClick={handleShare} size="4">
            <BsShare className="inline" />
            Or share the link!
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
