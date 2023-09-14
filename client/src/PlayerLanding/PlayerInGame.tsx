import { Button, Flex, Text } from "@radix-ui/themes";
import { useDefiniteGame } from "../store/GameContext";
import { MeaningfulIcon } from "../shared/MeaningfulIcon";
import { LiaVoteYeaSolid } from "react-icons/lia";
import classNames from "classnames";
import { useState } from "react";
import { useMe } from "../store/secretKey";

const filters = ["dead", "can vote", "alive", "all"] as const;
type Filters = (typeof filters)[number];

export function PlayerInGame() {
  const { game } = useDefiniteGame();
  const me = useMe();
  const [filter, setFilter] = useState<Filters>(filters[0]);
  const allPlayers = Object.keys(game.playersToRoles).sort();
  const playerFilters = {
    all: allPlayers,
    alive: allPlayers.filter((p) => !game.deadPlayers[p]),
    dead: allPlayers.filter((p) => game.deadPlayers[p]),
    "can vote": allPlayers.filter(
      (p) => !(game.deadPlayers[p] && game.deadVotes[p]),
    ),
  };
  const players = playerFilters[filter];

  return (
    <Flex direction="column" gap="1" className="flex-1 overflow-hidden">
      <Flex direction="column" gap="1" className="border-b border-red-700 p-2">
        <Flex justify="between" p="2">
          <Text className="capitalize">{me}</Text>
          <Text className="capitalize">
            {game.deadPlayers[me] ? "Dead" : "Alive"}
          </Text>
          <Text className="capitalize">
            {!(game.deadPlayers[me] && game.deadVotes[me])
              ? "Vote available"
              : "Cannot vote"}
          </Text>
        </Flex>

        <Flex gap="1" wrap="wrap-reverse">
          {filters.map((f) => (
            <Button
              size="1"
              color="red"
              onClick={() => setFilter(f)}
              className="min-w-fit flex-1 capitalize"
              variant={f === filter ? "solid" : "surface"}
            >
              {f}({playerFilters[f].length})
            </Button>
          ))}
        </Flex>
      </Flex>
      <Flex direction="column" gap="3" p="2" className="flex-1 overflow-y-auto">
        {players.map((player) => (
          <Flex
            gap="1"
            // justify="between"
            className={classNames(game.deadPlayers[player] && "line-through")}
          >
            <div className="w-5">
              {game.deadPlayers[player] && !game.deadVotes[player] && (
                <MeaningfulIcon
                  size="1"
                  // color="violet"
                  header="Player has a deadvote"
                  explanation="Each player gets one vote after they die.  This player has used theirs."
                >
                  <LiaVoteYeaSolid className="h-2" />
                </MeaningfulIcon>
              )}
            </div>

            <Text as="div" className="flex-1 capitalize">
              {player}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
