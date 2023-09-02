import { useEffect, useMemo, useState } from "react";
import { UnifiedGame } from "./Game";
import { doc, onSnapshot } from "firebase/firestore";
import { UnifiedGameContext } from "./GameContext";
import { unifiedGamesCollection } from "./firebaseStore";

export function GameProvider({
  gameId,
  children,
}: {
  gameId: string;
  children: React.ReactNode;
}) {
  const [game, setGame] = useState<UnifiedGame | undefined>(undefined);
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
    return onSnapshot(doc(unifiedGamesCollection, gameId), (snapshot) => {
      const data = snapshot.data() as unknown as UnifiedGame;
      setGame(data);
    });
  }, [gameId]);
  return (
    <UnifiedGameContext.Provider value={contextValue}>
      {children}
    </UnifiedGameContext.Provider>
  );
}
