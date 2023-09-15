import { Button, Flex, Table, Tabs, Text } from "@radix-ui/themes";
import { useDefiniteGame } from "../store/GameContext";
import { MeaningfulIcon } from "../shared/MeaningfulIcon";
import { LiaVoteYeaSolid } from "react-icons/lia";
import classNames from "classnames";
import { useMe } from "../store/secretKey";
import { BsPeopleFill } from "react-icons/bs";
import { GiScrollQuill } from "react-icons/gi";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getRoleExtension } from "../assets/game_data/gameData";

const filters = ["dead", "can vote", "alive", "all"] as const;
type Filters = (typeof filters)[number];

export function PlayerInGame() {
  const { game } = useDefiniteGame();
  const me = useMe();
  const [selectedTab, setSelectedTab] = React.useState("script");
  const [filter, setFilter] = React.useState<Filters>(filters[0]);
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

  const script: Record<CharacterType, RoleExtension[]> = React.useMemo(() => {
    const allCharacters = game.script
      ?.map(({ id }) => getRoleExtension(id))
      .map((character) => character);

    return {
      Townsfolk: allCharacters?.filter(({ team }) => team === "townsfolk"),
      Outsider: allCharacters?.filter(({ team }) => team === "outsider"),
      Minion: allCharacters?.filter(({ team }) => team === "minion"),
      Demon: allCharacters?.filter(({ team }) => team === "demon"),
      // Unknown: allCharacters?.filter(({ team }) => team === "Unknown"),
    };
  }, [game.script]);

  return (
    <Tabs.Root
      className="flex flex-1 flex-col"
      value={selectedTab}
      onValueChange={setSelectedTab}
    >
      <Tabs.List>
        <Tabs.Trigger value="script">
          Script
          <Text color="red" asChild>
            <GiScrollQuill />
          </Text>
        </Tabs.Trigger>
        <Tabs.Trigger value="players">
          Players
          <Text color="red" asChild>
            <BsPeopleFill />
          </Text>
        </Tabs.Trigger>
      </Tabs.List>

      <div className="relative flex-1 overflow-x-hidden">
        <AnimatePresence>
          {selectedTab === "script" && (
            <motion.div
              className="absolute h-full w-full"
              key="script"
              initial={{ x: "-100%", opacity: 0.3 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0.3 }}
              transition={{ type: "tween" }}
            >
              <Tabs.Content
                forceMount
                className="h-full overflow-y-auto"
                value="script"
              >
                {<Table.Root>{Object.entries(script)
        .filter(([_, characters]) => characters.length > 0)
        .map(([team, characters]) => ()}</Table.Root>}
              </Tabs.Content>
            </motion.div>
          )}
          {selectedTab === "players" && (
            <motion.div
              className="absolute h-full w-full"
              key="players"
              initial={{ x: "100%", opacity: 0.3 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.3 }}
              transition={{ type: "tween" }}
            >
              <Tabs.Content
                forceMount
                className="h-full overflow-y-auto"
                value="players"
              >
                <Flex
                  direction="column"
                  gap="1"
                  className="flex-1 overflow-hidden"
                >
                  <Flex
                    direction="column"
                    gap="1"
                    className="border-b border-red-700 p-2"
                  >
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
                  <Flex
                    direction="column"
                    gap="3"
                    p="2"
                    className="flex-1 overflow-y-auto"
                  >
                    {players.map((player) => (
                      <Flex
                        gap="1"
                        // justify="between"
                        className={classNames(
                          game.deadPlayers[player] && "line-through",
                        )}
                      >
                        <div className="w-5">
                          {game.deadPlayers[player] &&
                            !game.deadVotes[player] && (
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
              </Tabs.Content>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Tabs.Root>
  );
}
