import { useMemo } from "react";
import { useGame } from "./GameContext";
import { useLocalStorage } from "./useLocalStorage";

export function usePlayer(): [string | null, (key: string | null) => void] {
  const { gameId } = useGame();
  const localhostKeyFromUrl = useMemo(
    () => new URLSearchParams(window.location.search).get("testPlayerKey"),
    [gameId],
  );
  const localhostKey = gameId
    ? `${gameId}${String(localhostKeyFromUrl ?? "")}_player`
    : null;
  const [value, setValue] = useLocalStorage(localhostKey);

  return [value, setValue];
}

export function useMe(): string {
  const [myName] = usePlayer();
  if (!myName) {
    throw new Error("Name not yet declared!");
  }
  return myName;
}

export function useCommonName(): [string | null, (key: string | null) => void] {
  const [value, setValue] = useLocalStorage("player_last_used_name");

  return [value, setValue];
}
