import { useEffect, useMemo, useRef, useState } from "react";
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
  const unmounted = useRef(false);

  const contextValue = useMemo(
    () => ({
      gameId,
      game: game ?? null,
    }),
    [gameId, game],
  );

  const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      retryOnError: true,
      shouldReconnect: (_closeEvent) => {
        return !unmounted.current;
      },
      reconnectAttempts: 10000,
      reconnectInterval: 1000,
    },
  );

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

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
      {readyState !== ReadyState.OPEN &&
        readyState !== ReadyState.CONNECTING && (
          <Callout.Root>
            <Callout.Text>
              You're currently disconnected from the server. Attempting to
              reconnect.
            </Callout.Text>
          </Callout.Root>
        )}

      {children}
    </UnifiedGameContext.Provider>
  );
}
