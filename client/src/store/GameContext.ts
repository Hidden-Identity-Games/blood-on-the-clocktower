import { createContext, useContext, useState } from "react";
import { UnifiedGame } from "./Game";

export interface GameContext {
  gameId: string | null;
  game: UnifiedGame | null;
}

export const UnifiedGameContext = createContext<GameContext>({
  game: null,
  gameId: null,
});

export function useGame() {
  const game = useContext(UnifiedGameContext);
  return game;
}
export function useDefiniteGame(): { game: UnifiedGame; gameId: string } {
  const game = useContext(UnifiedGameContext);
  if (!game.game) {
    throw new Error("Not in a game?");
  }
  return game as { game: UnifiedGame; gameId: string };
}

export function useAction<Args extends Array<unknown>>(
  action: (...args: Args) => Promise<void>,
): [
  error: string | null,
  isLoading: boolean,
  succeeded: boolean,
  action: (...args: Args) => void,
  clear: () => void,
] {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const [succeeded, setSucceeded] = useState<boolean>(false);

  return [
    error,
    isLoading,
    succeeded,
    async (...args: Args) => {
      setIsLoading(true);
      setError(null);
      setSucceeded(false);
      try {
        if (args !== null) {
          await action(...args);
          setSucceeded(true);
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setIsLoading(false);
      }
    },
    () => {
      setError("");
      setIsLoading(false);
    },
  ];
}
