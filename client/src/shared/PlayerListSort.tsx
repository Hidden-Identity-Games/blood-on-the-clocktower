import { Button } from "@radix-ui/themes";
import { MdSort } from "react-icons/md";
import React from "react";
import { useDefiniteGame } from "../store/GameContext";
import { getCharacter } from "../assets/game_data/gameData";

interface PlayerListSortProps<T extends string> {
  allSorts: Record<T, ((a: T, b: T) => number)[]>;
  setSelectedSort: (sort: T) => void;
}

export function PlayerListSort<T extends string>({
  allSorts,
  setSelectedSort,
}: PlayerListSortProps<T>) {
  const [currentSort, setCurrentSort] = React.useState<T>(
    Object.keys(allSorts)[0] as T,
  );

  const keyRing = React.useMemo(
    () =>
      Object.keys(allSorts).reduce(
        (ring, sort, idx, keys) => {
          return { ...ring, [sort]: keys[(idx + 1) % keys.length] };
        },
        {} as Record<T, T>,
      ),
    [allSorts],
  );

  return (
    <Button
      size="1"
      onClick={() => {
        const nextSort = keyRing[currentSort] as T;
        setCurrentSort(nextSort);
        setSelectedSort(nextSort);
      }}
      className="min-w-fit flex-1 capitalize"
    >
      <MdSort />
      {currentSort}
    </Button>
  );
}

const sorts = ["none", "seat", "first night", "other night"] as const;
export type PlayerSorts = (typeof sorts)[number];
export function usePlayerSorts(playerList: string[]) {
  const { game } = useDefiniteGame();
  const sorts = {
    none: () => 0,
    seat: (a: string, b: string) => {
      const aPlr =
        (!game.orderedPlayers.problems &&
          game.orderedPlayers.fullList.indexOf(a)) ||
        1000;
      const bPlr =
        (!game.orderedPlayers.problems &&
          game.orderedPlayers.fullList.indexOf(b)) ||
        1000;

      return aPlr - bPlr;
    },
    "first night": (a: string, b: string) => {
      const aChar =
        getCharacter(game.playersToRoles[a])?.firstNight?.order ?? 1000;
      const bChar =
        getCharacter(game.playersToRoles[b])?.firstNight?.order ?? 1000;
      return aChar - bChar;
    },
    "other night": (a: string, b: string) => {
      const aChar =
        getCharacter(game.playersToRoles[a])?.otherNight?.order ?? 1000;
      const bChar =
        getCharacter(game.playersToRoles[b])?.otherNight?.order ?? 1000;
      return aChar - bChar;
    },
  };
  const sorted = useSorts(playerList, sorts);

  return sorted;
}

function useSorts<Sort extends string, ListItem>(
  fullList: ListItem[],
  sorts: Record<Sort, (a: ListItem, b: ListItem) => number>,
) {
  const sortedLists = React.useMemo(
    () =>
      Object.keys(sorts).reduce<Record<Sort, ListItem[]>>(
        (acc, sort) => ({
          ...acc,
          [sort]: fullList.sort(sorts[sort as Sort]),
        }),
        {} as Record<Sort, ListItem[]>,
      ),
    [fullList, sorts],
  );

  return sortedLists;
}
