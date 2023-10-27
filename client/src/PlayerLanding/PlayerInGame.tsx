import { Button, Flex, Heading, Separator, Tabs, Text } from "@radix-ui/themes";
import { useDefiniteGame } from "../store/GameContext";
import { MeaningfulIcon } from "../shared/MeaningfulIcon";
import { LiaVoteYeaSolid } from "react-icons/lia";
import classNames from "classnames";
import { useMe } from "../store/usePlayer";
import { BsFillMoonStarsFill, BsPeopleFill } from "react-icons/bs";
import { GiScrollQuill } from "react-icons/gi";
import React, { useState } from "react";
import {
  getCharacter,
  DistributionsByPlayerCount,
} from "../assets/game_data/gameData";
import { colorMap } from "../shared/CharacterTypes";
import { CharacterType } from "../types/script";
import {
  PlayerFilter,
  PlayerListFilters,
  usePlayerFilters,
} from "../shared/PlayerListFilters";
import { CharacterName } from "../shared/RoleIcon";
import { ForPlayerPlayerRoleIcon } from "../GamemasterInGame/PlayerListComponents/PlayerRole";
import { ScriptList } from "../shared/ScriptList";
import {
  PlayerListOrder,
  PlayerOrder,
  usePlayerOrder,
} from "../shared/PlayerListOrder";

export function PlayerInGame() {
  const { game, script } = useDefiniteGame();
  const me = useMe();
  const [selectedTab, setSelectedTab] = React.useState("script");
  const [selectedOrder, setSelectedOrder] =
    useState<PlayerOrder>("alphabetical");
  const [firstSeat, setFirstSeat] = useState(me);
  const orderedPlayers = usePlayerOrder(selectedOrder, firstSeat);
  const allFilters = usePlayerFilters(orderedPlayers);
  const [selectedFilter, setSelectedFilter] = useState<PlayerFilter>("all");
  const filteredPlayers = allFilters[selectedFilter];
  const [isFirstNightSort, setIsFirstNightSort] = React.useState(false);

  const nightOrder = React.useMemo(() => {
    const charactersFromScript =
      script?.map(({ id }) => getCharacter(id))?.filter(Boolean) ?? [];
    const travelerCharacters = Object.values(game.playersToRoles)
      .map((role) => getCharacter(role))
      .filter((character) => character.team === "Traveler");

    const allCharacters = [...charactersFromScript, ...travelerCharacters];

    const nightOrder = {
      otherNight: allCharacters
        .filter((character) => character.otherNight?.order ?? 0 > 0)
        .sort(
          (a, b) => (a.otherNight?.order ?? 0) - (b.otherNight?.order ?? 0),
        ),
      firstNight: allCharacters
        .filter((character) => character.firstNight?.order ?? 0 > 0)
        .sort(
          (a, b) => (a.firstNight?.order ?? 0) - (b.firstNight?.order ?? 0),
        ),
    };

    return nightOrder;
  }, [script, game.playersToRoles]);

  const travelerCharacters = Object.values(game.playersToRoles)
    .map((role) => getCharacter(role))
    .filter((character) => character.team === "Traveler");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { Traveler, ...distributionsByPlayerCount } = {
    ...DistributionsByPlayerCount[
      game.playerList.length - travelerCharacters.length
    ],
  };

  return (
    <Tabs.Root
      className="flex flex-1 flex-col overflow-hidden"
      value={selectedTab}
      onValueChange={setSelectedTab}
    >
      <Tabs.List>
        <Tabs.Trigger className="flex-1" value="script">
          <Text className="mr-1" color="red" asChild>
            <GiScrollQuill />
          </Text>
          {selectedTab === "script" && "Script"}
        </Tabs.Trigger>
        <Tabs.Trigger className="flex-1" value="night-order">
          <Text className="mr-1" color="red" asChild>
            <BsFillMoonStarsFill />
          </Text>
          {selectedTab === "night-order" && "Night Order"}
        </Tabs.Trigger>
        <Tabs.Trigger className="flex-1" value="players">
          <Text className="mr-1" color="red" asChild>
            <BsPeopleFill />
          </Text>
          {selectedTab === "players" && "Players"}
        </Tabs.Trigger>
      </Tabs.List>

      {selectedTab === "night-order" && (
        <Button
          className="mx-2 my-1"
          size="1"
          variant={isFirstNightSort ? "solid" : "outline"}
          onClick={() => setIsFirstNightSort((prev) => !prev)}
        >
          {isFirstNightSort ? "Viewing First Night" : "Viewing Other Night"}
        </Button>
      )}

      <Tabs.Content className="flex-1 overflow-y-auto" value="script">
        <Flex className="m-2" direction="column" gap="3">
          <Flex wrap="wrap">
            {Object.entries(distributionsByPlayerCount).map(([team, count]) => (
              <Text
                color={colorMap[team as CharacterType]}
                className="min-w-[60px] flex-1 text-center"
                onClick={() => {
                  document.querySelector(`#${team}`)?.scrollIntoView();
                }}
              >
                <Text
                  size="1"
                  as="div"
                  className="text-clip whitespace-nowrap"
                  style={{
                    fontSize: 16,
                  }}
                >
                  {["Townsfolk"].includes(team) ? team : `${team}s`}
                </Text>
                {count}
              </Text>
            ))}
          </Flex>
          <Separator size="4" />
          <ScriptList />
        </Flex>
      </Tabs.Content>

      <Tabs.Content className="flex-1 overflow-y-auto" value="night-order">
        <Flex className="m-2" direction="column" gap="3">
          {nightOrder[isFirstNightSort ? "firstNight" : "otherNight"].map(
            (character) => (
              <Flex key={character.id} gap="2">
                <Flex direction="column">
                  <Heading size="2" className="flex-1">
                    <CharacterName role={character.id} />
                  </Heading>
                  <Text size="1" weight="light" className="pl-5">
                    {character.ability}
                  </Text>
                </Flex>
              </Flex>
            ),
          )}
        </Flex>
      </Tabs.Content>

      <Tabs.Content className="flex-1 overflow-y-auto" value="players">
        <Flex direction="column" gap="1" className="flex-1 overflow-hidden">
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

            <PlayerListFilters
              allFilters={allFilters}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
            <PlayerListOrder
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
              setFirstSeat={setFirstSeat}
              player={me}
            />
            <Separator size="4" />
          </Flex>
          <Flex
            direction="column"
            gap="3"
            p="2"
            className="flex-1 overflow-y-auto"
          >
            {filteredPlayers.map((player) => (
              <Flex
                key={player}
                gap="1"
                className={classNames(
                  game.deadPlayers[player] && "line-through",
                )}
              >
                <div className="w-5">
                  {(!game.deadPlayers[player] || !game.deadVotes[player]) && (
                    <MeaningfulIcon
                      size="1"
                      color={game.deadPlayers[player] ? "violet" : "gray"}
                      header="Player has a deadvote"
                      explanation="Each player gets one vote after they die.  This player has not used theirs yet."
                    >
                      <LiaVoteYeaSolid className="h-2" />
                    </MeaningfulIcon>
                  )}
                </div>

                <Text
                  color={game.travelers[player] ? "amber" : undefined}
                  as="div"
                  className="flex-1 capitalize"
                >
                  {player}
                </Text>
                {game.travelers[player] && (
                  <ForPlayerPlayerRoleIcon player={player}>
                    {getCharacter(game.playersToRoles[player])?.ability}
                  </ForPlayerPlayerRoleIcon>
                )}
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Tabs.Content>
    </Tabs.Root>
  );
}
