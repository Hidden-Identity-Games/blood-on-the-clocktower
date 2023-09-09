import { useGame } from "./GameContext";
import { useLocalStorage } from "./useLocalStorage";

export function usePlayer(): [string | null, (key: string) => void] {
  const { gameId } = useGame();
  const [value, setValue] = useLocalStorage(`${gameId}_player`);

  return [value, setValue];
}

export function useMe(): string {
  const [myName] = usePlayer();
  if (!myName) {
    throw new Error("Name not yet declared!");
  }
  return myName;
}
