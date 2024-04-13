import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { Callout, Flex, Heading, Link, Text } from "@radix-ui/themes";
import QRCode from "qrcode.react";
import { BsShare } from "react-icons/bs";
import { Link as ReactRouterLink } from "react-router-dom";

import { useGame } from "../store/GameContext";
import { urlFromOrigin } from "../store/url";
import { LoadingExperience } from "./LoadingExperience";

export function GameStatus() {
  const { game } = useGame();
  if (!game) {
    return <LoadingExperience>Loading</LoadingExperience>;
  }
  if (game.gameStatus !== "Started") {
    return `Status: ${game.gameStatus}`;
  }
  return `${game.time.time}: ${game.time.count}`;
}

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
          <GameStatus />
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
      return navigator.clipboard.writeText(url);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Flex align="center" gap="1" asChild>
          <button>
            <Text color="amber">Game:</Text>
            <Text className="truncate">{gameId}</Text>
            <BsShare className="text-sm" />
          </button>
        </Flex>
      </Dialog.Trigger>

      <Dialog.Content className="">
        <Dialog.Header>Scan to Join</Dialog.Header>

        <Dialog.Description className=" flex flex-col items-center justify-around gap-2">
          <div className="m-4 bg-white p-1">
            <QRCode value={url} size={256} fgColor="darkred" />
          </div>
          <Button className="w-full" onClick={() => void handleShare()}>
            <BsShare className="mr-2 inline" />
            Or share the link!
          </Button>
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  );
}
