import { useEffect, useMemo, useState } from "react";
import { UnifiedGame } from "./Game";
import { UnifiedGameContext } from "./GameContext";
import { Callout } from "@radix-ui/themes";
import { ReadyState } from "react-use-websocket";
import { LoadingExperience } from "../shared/LoadingExperience";
import { Script } from "@hidden-identity/shared";
import { trpc } from "../shared/trpcClient";
import { useGameId } from "./url";

export function GameProvider({ children }: { children: React.ReactNode }) {
  const gameId = useGameId();
  const [game, setGame] = useState<UnifiedGame | null>(null);
  const [script, setScript] = useState<Script | null>([
    { id: "baron" },
    { id: "chef" },
    { id: "empath" },
    { id: "fortune_teller" },
    { id: "monk" },
    { id: "virgin" },
    { id: "slayer" },
    { id: "soldier" },
    { id: "mayor" },
    { id: "librarian" },
    { id: "investigator" },
    { id: "undertaker" },
    { id: "ravenkeeper" },
    { id: "washerwoman" },
    { id: "butler" },
    { id: "recluse" },
    { id: "saint" },
    { id: "poisoner" },
    { id: "spy" },
    { id: "scarlet_woman" },
    { id: "imp" },
  ] as Script);
  const [readyState, setReady] = useState<ReadyState>(
    ReadyState.UNINSTANTIATED,
  );

  const contextValue = useMemo(
    () => ({
      gameId,
      game: game,
      script: script,
    }),
    [gameId, game, script],
  );

  useEffect(() => {
    if (!gameId) {
      return;
    }

    const unsub = trpc.subscribeToGame.subscribe(
      { gameId },
      {
        onData: (data) => {
          if (data.objectType === "game") {
            setGame(data.nextObj);
          }
          if (data.objectType === "script") {
            setScript(data.nextObj);
          }
        },
        onError: () => {},
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
  }, [gameId]);

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
