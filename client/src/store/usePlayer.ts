import { useMemo } from "react";
import { useGame } from "./GameContext";
import { useLocalStorage } from "./useLocalStorage";

export function usePlayer(): [string | null, (key: string | null) => void] {
  const { gameId } = useGame();
  const localhostKeyFromUrl = useMemo(
    () => new URLSearchParams(window.location.search).get("testPlayerKey"),
    [gameId],
  );
  const localhostKey = localhostKeyFromUrl
    ? `hidden-identity_${String(localhostKeyFromUrl)}_player}`
    : "hidden-identity_player";
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

export function useHasJoinedGame(): [boolean, (key: boolean) => void] {
  const { gameId } = useGame();
  const [value, setValue] = useLocalStorage(`hasJoined_${gameId}`);

  return gameId
    ? [value === "true", (hasJoined: boolean) => setValue(String(hasJoined))]
    : [false, () => {}];
}
