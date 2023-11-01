import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const FIRST_SEAT_KEY = "firstSeat";

export function useFirstSeat(): [string | undefined, (next: string) => void] {
  const [search, setSearch] = useSearchParams();
  const setFirstPlayer = useCallback(
    (player: string) => {
      setSearch((s) => {
        s.set(FIRST_SEAT_KEY, player);
        return s;
      });
    },
    [setSearch],
  );
  return [search.get(FIRST_SEAT_KEY) ?? undefined, setFirstPlayer];
}
