import { Button, Flex } from "@radix-ui/themes";
import { useMemo } from "react";
import { useDefiniteGame } from "../store/GameContext";

interface PlayerListFiltersProps<T extends string> {
  allFilters: Record<T, unknown[]>;
  selectedFilter: T | null;
  setSelectedFilter: (filter: T) => void;
}

export function PlayerListFilters<T extends string>({
  allFilters,
  selectedFilter,
  setSelectedFilter,
}: PlayerListFiltersProps<T>) {
  return (
    <Flex gap="1" wrap="wrap-reverse">
      {Object.entries<unknown[]>(allFilters).map(([filter, players]) => (
        <Button
          key={filter}
          size="1"
          onClick={() => {
            setSelectedFilter(filter as T);
          }}
          className="min-w-fit flex-1 capitalize"
          variant={filter === selectedFilter ? "solid" : "surface"}
        >
          {filter} ({players.length})
        </Button>
      ))}
    </Flex>
  );
}

const filters = ["alive", "dead", "can vote", "all"] as const;

type Filters = (typeof filters)[number];
export type PlayerFilter = Filters;
export function usePlayerFilters(playerList: string[]) {
  const { game } = useDefiniteGame();
  const filters = useMemo(
    () => ({
      alive: (p: string) => !game.deadPlayers[p],
      dead: (p: string) => !!game.deadPlayers[p],
      "can vote": (p: string) => !(game.deadPlayers[p] && game.deadVotes[p]),
      all: () => true,
    }),
    [game.deadPlayers, game.deadVotes],
  );
  const filtered = useFilters(playerList, filters);

  return filtered;
}

function useFilters<Filter extends string, ListItem>(
  fullList: ListItem[],
  filters: Record<Filter, (t: ListItem) => boolean>,
) {
  const filteredLists = useMemo(
    () =>
      Object.keys(filters).reduce<Record<Filter, ListItem[]>>(
        (acc, filter) => ({
          ...acc,
          [filter]: fullList.filter(filters[filter as Filter]),
        }),
        {} as Record<Filter, ListItem[]>,
      ),
    [fullList, filters],
  );
  return filteredLists;
}
