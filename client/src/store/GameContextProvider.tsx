import { useEffect, useMemo, useState } from "react";
import { UnifiedGame } from "./Game";
import { UnifiedGameContext } from "./GameContext";
import { createMessage, parseMessage } from "./messenger";
import { Callout } from "@radix-ui/themes";
import useWebSocket, { ReadyState } from "react-use-websocket";

export function GameProvider({
  gameId,
  children,
}: {
  gameId: string;
  children: React.ReactNode;
}) {
  const [game, setGame] = useState<UnifiedGame | null>(null);

  const contextValue = useMemo(
    () =>
      gameId && game
        ? {
            gameId,
            game,
          }
        : { game: null, gameId: null },
    [gameId, game],
  );

  const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket(WS_URL);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage(
        createMessage({
          gameId,
          type: "ListenToGame",
        }),
      );
    }
  }, [readyState, gameId, sendJsonMessage]);

  useEffect(() => {
    if (!lastJsonMessage) {
      return;
    }
    const parsedMessage = parseMessage(lastJsonMessage);
    if (
      parsedMessage.type === "ObjectUpdated" &&
      parsedMessage.objectType === "game" &&
      parsedMessage.updatedId === gameId
    ) {
      setGame(parsedMessage.nextObj);
    }
  }, [gameId, lastJsonMessage]);

  return (
    <UnifiedGameContext.Provider value={contextValue}>
      {readyState !== ReadyState.OPEN && (
        <Callout.Root>
          <Callout.Text>
            <p>
              You're currently disconnected from the server. Attempting to
              reconnect.
            </p>
          </Callout.Text>
        </Callout.Root>
      )}
      {children}
    </UnifiedGameContext.Provider>
  );
}
