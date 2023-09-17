import { Flex, Heading, Tabs, Text } from "@radix-ui/themes";
import { useDefiniteGame } from "../store/GameContext";
import { MeaningfulIcon } from "../shared/MeaningfulIcon";
import { LiaVoteYeaSolid } from "react-icons/lia";
import classNames from "classnames";
import { useMe } from "../store/secretKey";
import {
  BsFillMoonFill,
  BsFillMoonStarsFill,
  BsPeopleFill,
} from "react-icons/bs";
import { GiScrollQuill } from "react-icons/gi";
import React from "react";
import { getCharacter } from "../assets/game_data/gameData";
import { colorMap } from "../shared/CharacterTypes";
import { CharacterType } from "../types/script";
import { PlayerListFilters } from "../shared/PlayerListFilters";
import { usePlayerFilters } from "../store/useStore";

export function PlayerInGame() {
  const { game, script } = useDefiniteGame();
  const me = useMe();
  const [selectedTab, setSelectedTab] = React.useState("script");
  const [filteredPlayers, selectedFilter, allFilters, setSelectedFilter] =
    usePlayerFilters();

  const [nightOrder, charactersByType] = React.useMemo(() => {
    const allCharacters = script?.map(({ id }) => getCharacter(id)) ?? [];

    const nightOrder = allCharacters
      .filter((character) => character.otherNight?.order ?? 0 > 0)
      .sort((a, b) => (a.otherNight?.order ?? 0) - (b.otherNight?.order ?? 0));

    return [
      nightOrder,
      {
        Townsfolk: allCharacters.filter(({ team }) => team === "Townsfolk"),
        Outsider: allCharacters.filter(({ team }) => team === "Outsider"),
        Minion: allCharacters.filter(({ team }) => team === "Minion"),
        Demon: allCharacters.filter(({ team }) => team === "Demon"),
        // Unknown: allCharacters.filter(({ team }) => team === "Unknown"),
      },
    ];
  }, [script]);

  return (
    <Tabs.Root
      className="flex flex-1 flex-col"
      value={selectedTab}
      onValueChange={setSelectedTab}
    >
      <Tabs.List>
        <Tabs.Trigger className="min-w-[100px] flex-1" value="script">
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

      <div className="relative flex-1 overflow-x-hidden">
        <Tabs.Content className="h-full overflow-y-auto" value="script">
          <Flex className="m-2" direction="column" gap="3">
            {Object.entries(charactersByType)
              .filter(([_, characters]) => characters.length > 0)
              .map(([team, characters]) => (
                <React.Fragment key={team}>
                  <Flex justify="end">
                    <Heading
                      size="3"
                      align="right"
                      color={colorMap[team as CharacterType]}
                      asChild
                    >
                      <Flex gap="2">
                        <span className="scale-x-[-1]">
                          <BsFillMoonFill />
                        </span>
                        {team === "Townsfolk" ? `${team}` : `${team}s`}
                      </Flex>
                    </Heading>
                  </Flex>
                  {characters.map((char, idx) => (
                    <Flex
                      key={char.id}
                      className={classNames(idx % 2 === 0 && "bg-stone-900")}
                      gap="2"
                    >
                      <Flex direction="column">
                        {/* <img src={char.imageSrc} className="h-5 w-5" /> */}
                        <Heading
                          size="2"
                          className="flex-1"
                          color={colorMap[team as CharacterType]}
                        >
                          {char.name}
                        </Heading>
                      </Flex>
                      <Text size="1" weight="light" className="flex-[5]">
                        {char.ability}
                      </Text>
                    </Flex>
                  ))}
                </React.Fragment>
              ))}
          </Flex>
        </Tabs.Content>

        <Tabs.Content className="h-full overflow-y-auto" value="night-order">
          <Flex className="m-2" direction="column" gap="3">
            {nightOrder.map((character, idx) => (
              <Flex
                key={character.id}
                className={classNames(idx % 2 === 0 && "bg-stone-900")}
                gap="2"
              >
                <Flex direction="column">
                  {/* <img src={char.imageSrc} className="h-5 w-5" /> */}
                  <Heading
                    size="2"
                    className="flex-1"
                    color={colorMap[character.team as CharacterType]}
                  >
                    {character.name}
                  </Heading>
                </Flex>
                <Text size="1" weight="light" className="flex-[5]">
                  {character.ability}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Tabs.Content>

        <Tabs.Content className="h-full overflow-y-auto" value="players">
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
                setSelectedFilter={setSelectedFilter as (f: string) => void}
              />
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
                  // justify="between"
                  className={classNames(
                    game.deadPlayers[player] && "line-through",
                  )}
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
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
}
