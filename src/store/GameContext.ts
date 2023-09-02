import { createContext, useContext, useState } from "react";
import { UnifiedGame } from "./Game";
import { doc, setDoc } from "firebase/firestore";
import { unifiedGamesCollection } from "./firebaseStore";

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

export function useAction<Args extends Array<unknown>>(
  action: (...args: Args) => Promise<void>,
): [
  error: string | null,
  isLoading: boolean,
  succeeded: boolean,
  action: (...args: Args) => void,
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
  ];
}
export function useChangeGame<Args extends Array<unknown>>(
  updateGame: (game: UnifiedGame, ...args: Args) => UnifiedGame,
) {
  const { gameId, game } = useGame();

  return useAction(async (...args: Args) => {
    if (!gameId) {
      throw new Error("calling change game without a gameID");
    }
    await setDoc(
      doc(unifiedGamesCollection, gameId),
      updateGame({ ...game }, ...args),
      {
        merge: true,
      },
    );
  });
}
