import { Callout, CalloutIcon } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { ReadyState } from "react-use-websocket";

import { LoadingExperience } from "../shared/LoadingExperience";
import { trpc } from "../shared/trpcClient";
import { type UnifiedGame } from "./Game";
import { UnifiedGameContext } from "./GameContext";
import { RESET_SEARCH_PARAMS, useGameId, useSafeNavigate } from "./url";

export function GameProvider({ children }: { children: React.ReactNode }) {
  const gameId = useGameId();
  const [error, setError] = useState<string | null>(null);
  const navigate = useSafeNavigate();
  const [game, setGame] = useState<UnifiedGame | null>(null);
  const [readyState, setReady] = useState<ReadyState>(
    ReadyState.UNINSTANTIATED,
  );

  const contextValue = useMemo(
    () => ({
      gameId,
      game: game,
    }),
    [gameId, game],
  );

  useEffect(() => {
    setError(null);
    if (!gameId) {
      return;
    }
    try {
      const unsub = trpc.subscribeToGame.subscribe(
        { gameId },
        {
          onData: (data) => {
            if (data.objectType === "game") {
              setGame(data.nextObj);
            }
          },
          onError: () => {
            setError("Cannot find game");
          },
          onStarted: () => {
            setReady(ReadyState.OPEN);
          },
          onStopped: () => {
            setReady(ReadyState.CLOSED);
          },
        },
      );
      return () => {
        unsub.unsubscribe();
      };
    } catch (e) {
      setError("Error subscribing to game");
      return () => {};
    }
  }, [gameId]);

  return (
    <UnifiedGameContext.Provider value={contextValue}>
      {error && (
        <Callout.Root onClick={() => navigate("", RESET_SEARCH_PARAMS)}>
          <CalloutIcon />
          <Callout.Text>
            Game not found. Click here to head back to the homepage.
          </Callout.Text>
        </Callout.Root>
      )}
      {gameId && readyState !== ReadyState.OPEN && (
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
