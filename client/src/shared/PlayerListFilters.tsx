import React from "react";
import { useDefiniteGame } from "../store/GameContext";
import { Button, Flex } from "@radix-ui/themes";

const filters = ["all", "alive", "dead", "can vote"] as const;
type Filters = (typeof filters)[number];

interface PlayerListFiltersProps {
  playerList: string[];
  setFilteredPlayers: (filteredPlayers: string[]) => void;
}

export function PlayerListFilters({
  playerList,
  setFilteredPlayers,
}: PlayerListFiltersProps) {
  const { game } = useDefiniteGame();
  const [filter, setFilter] = React.useState<Filters>(filters[0]);

  const playerFilters = React.useMemo(() => {
    const playerFilters = {
      all: playerList,
      alive: playerList.filter((p) => !game.deadPlayers[p]),
      dead: playerList.filter((p) => game.deadPlayers[p]),
      "can vote": playerList.filter(
        (p) => !(game.deadPlayers[p] && game.deadVotes[p]),
      ),
    };

    return playerFilters;
  }, [game.deadPlayers, game.deadVotes, playerList]);

  return (
    <Flex gap="1" wrap="wrap-reverse">
      {filters.map((f) => (
        <Button
          key={f}
          size="1"
          onClick={() => {
            setFilter(f);
            setFilteredPlayers(playerFilters[f]);
          }}
          className="min-w-fit flex-1 capitalize"
          variant={f === filter ? "solid" : "surface"}
        >
          {f}({playerFilters[f].length})
        </Button>
      ))}
    </Flex>
  );
}
