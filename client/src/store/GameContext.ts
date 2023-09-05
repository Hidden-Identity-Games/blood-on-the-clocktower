import { createContext, useContext, useState } from "react";
import { UnifiedGame } from "./Game";

export interface GameContext {
  gameId: string;
  game: UnifiedGame;
}

export const UnifiedGameContext = createContext<
  GameContext | { gameId: null; game: null }
>({ game: null, gameId: null });

export function useGame() {
  const game = useContext(UnifiedGameContext);
  return game;
}
export function useDefiniteGame() {
  const game = useContext(UnifiedGameContext);
  if (!game.game) {
    throw new Error("Not in a game?");
  }
  return game;
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
