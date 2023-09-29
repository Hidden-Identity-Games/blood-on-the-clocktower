import { useEffect, useMemo, useRef, useState } from "react";
import { UnifiedGame } from "./Game";
import { UnifiedGameContext } from "./GameContext";
import { createMessage, parseMessage } from "./messenger";
import { Callout } from "@radix-ui/themes";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { LoadingExperience } from "../shared/LoadingExperience";
import { RoleSelection, Script } from "@hidden-identity/server";
import { exhaustiveCheck } from "../utils/exhaustiveCheck";

export function GameProvider({
  gameId,
  children,
}: {
  gameId: string;
  children: React.ReactNode;
}) {
  const [game, setGame] = useState<UnifiedGame | null>(null);
  const [script, setScript] = useState<Script | null>(null);
  const [roleSelect, setRoleSelect] = useState<RoleSelection | null>(null);
  const unmounted = useRef(false);

  const contextValue = useMemo(
    () => ({
      gameId,
      game: game,
      script: script,
      roleSelect: roleSelect,
    }),
    [gameId, game, script, roleSelect],
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
    switch (parsedMessage.objectType) {
      case "game": {
        if (parsedMessage.updatedId === gameId) {
          setGame(parsedMessage.nextObj);
        }
        return;
      }
      case "script": {
        if (parsedMessage.updatedId === gameId) {
          setScript(parsedMessage.nextObj);
        }
        return;
      }
      case "roleSelect": {
        if (parsedMessage.updatedId === gameId) {
          setRoleSelect(parsedMessage.nextObj);
        }
        return;
      }
      default:
        exhaustiveCheck(parsedMessage);
    }
  }, [gameId, lastJsonMessage]);

  return (
    <UnifiedGameContext.Provider value={contextValue}>
      {readyState !== ReadyState.OPEN && (
        <LoadingExperience>
          <Callout.Root>
            <Callout.Text>
              You're currently disconnected from the server. Attempting to
              reconnect.
            </Callout.Text>
          </Callout.Root>
        </LoadingExperience>
      )}

      {children}
    </UnifiedGameContext.Provider>
  );
}
