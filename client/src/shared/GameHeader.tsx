import { Callout, Flex, Heading, Link, Text } from "@radix-ui/themes";
import { useGame } from "../store/GameContext";
import { BsShare } from "react-icons/bs";
import { Link as ReactRouterLink } from "react-router-dom";

export function GameHeader() {
  const { gameId, game } = useGame();
  const url = `${document.location.protocol}//${document.location.hostname}${
    document.location.port ? `:${document.location.port}` : ""
  }/${gameId}`;
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url, title: url, text: url });
      } catch (error) {
        console.log("Failed to share.");
      }
    } else {
      navigator.clipboard.writeText(url);
      // setShowSnackbar(true);
      // setTimeout(() => setShowSnackbar(false), 2000);
    }
  };

  return (
    <>
      <Flex
        gap="2"
        justify="between"
        p="1"
        align="center"
        className="border-b-2 border-red-900"
      >
        <Link
          onClick={handleShare}
          size="2"
          className="flex-1 whitespace-nowrap"
        >
          <Text color="amber">Game:</Text> {gameId}
          <BsShare className="ml-.5 inline text-xs" />
        </Link>
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
