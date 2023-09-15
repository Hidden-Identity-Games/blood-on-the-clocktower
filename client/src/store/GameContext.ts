import { createContext, useContext, useState } from "react";
import { UnifiedGame } from "./Game";
import { Script } from "@hidden-identity/server";

type NonNullableValues<T> = { [K in keyof T]: NonNullable<T[K]> };
export interface GameContext {
  gameId: string | null;
  game: UnifiedGame | null;
  script: Script | null;
}

export const UnifiedGameContext = createContext<GameContext>({
  game: null,
  script: null,
  gameId: null,
});

export function useGame() {
  const game = useContext(UnifiedGameContext);
  return game;
}
export function useDefiniteGame(): NonNullableValues<GameContext> {
  const context = useContext(UnifiedGameContext);
  if (!context.game || !context.script || !context.gameId) {
    throw new Error("Not in a game?");
  }
  return context as NonNullableValues<GameContext>;
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
