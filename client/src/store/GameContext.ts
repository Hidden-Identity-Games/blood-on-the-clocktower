import { createContext, useContext, useState } from "react";

import { type UnifiedGame } from "./Game";

type NonNullableValues<T> = { [K in keyof T]: NonNullable<T[K]> };
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
export function useDefiniteGame(): NonNullableValues<GameContext> {
  const context = useContext(UnifiedGameContext);
  if (!context.game || !context.gameId) {
    throw new Error("Not in a game?");
  }
  return context as NonNullableValues<GameContext>;
}

export function useAction<Args extends Array<unknown>, T>(
  action: (...args: Args) => Promise<T | undefined>,
): [
  error: string | null,
  isLoading: boolean,
  value: T | null,
  action: (...args: Args) => Promise<T | undefined>,
  clear: () => void,
] {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const [value, setValue] = useState<T | null>(null);

  return [
    error,
    isLoading,
    value,
    async (...args: Args) => {
      setIsLoading(true);
      setError(null);
      setValue(null);
      try {
        if (args !== null) {
          const res = await action(...args);
          setValue(res as T);
          return res;
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
