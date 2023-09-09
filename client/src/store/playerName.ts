import { useEffect, useState } from "react";

export function usePlayerName(): [string, (key: string) => void] {
  const [playerName, setPlayerName] = useState<string>(
    localStorage.getItem("playerName") ?? "no-name",
  );

  useEffect(() => {
    localStorage.setItem("playerName", playerName);
  }, [playerName]);

  return [playerName, setPlayerName];
}
