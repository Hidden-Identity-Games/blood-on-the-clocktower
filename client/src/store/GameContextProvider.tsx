import { useEffect, useMemo, useState } from "react";
import { UnifiedGame } from "./Game";
import { UnifiedGameContext } from "./GameContext";
import { createMessage, parseMessage } from "./messenger";
import { apiUrl } from "./urlBuilder";

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

  useEffect(() => {
    if (!gameId) {
      return;
    }

    const socket = new WebSocket(WS_URL);
    socket.onopen = () => {
      socket.send(
        createMessage({
          gameId,
          type: "ListenToGame",
        }),
      );
    };
    socket.onmessage = (event: MessageEvent<string>) => {
      const parsedMessage = parseMessage(event.data);
      if (
        parsedMessage.type === "ObjectUpdated" &&
        parsedMessage.objectType === "game"
      )
        setGame(parsedMessage.nextObj);
    };

    return () => socket.close();
  }, [gameId]);
  return (
    <UnifiedGameContext.Provider value={contextValue}>
      {children}
    </UnifiedGameContext.Provider>
  );
}
