import { useGame } from "./GameContext";
import { useLocalStorage } from "./useLocalStorage";

export function usePlayer(): [string | null, (key: string | null) => void] {
  const { gameId } = useGame();
  const [value, setValue] = useLocalStorage(gameId ? `${gameId}_player` : null);

  return [value, setValue];
}

export function useMe(): string {
  const [myName] = usePlayer();
  if (!myName) {
    throw new Error("Name not yet declared!");
  }
  return myName;
}
