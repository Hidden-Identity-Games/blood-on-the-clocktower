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
import React, { useState } from "react";
import { getCharacter } from "../assets/game_data/gameData";
import { colorMap } from "../shared/CharacterTypes";
import { Character, CharacterType } from "../types/script";
import {
  PlayerFilter,
  PlayerListFilters,
  usePlayerFilters,
} from "../shared/PlayerListFilters";
import { CharacterName } from "../shared/RoleIcon";
import { ForPlayerPlayerRoleIcon } from "../GamemasterInGame/PlayerListComponents/PlayerRole";

export function PlayerInGame() {
  const { game, script } = useDefiniteGame();
  const me = useMe();
  const [selectedTab, setSelectedTab] = React.useState("script");
  const [selectedFilter, setSelectedFilter] = useState<PlayerFilter>("all");
  const allFilters = usePlayerFilters(game.playerList);
  const filteredPlayers = allFilters[selectedFilter];

  const [nightOrder, charactersByType] = React.useMemo(() => {
    const charactersFromScript =
      script?.map(({ id }) => getCharacter(id)) ?? [];
    const travelerCharacters = Object.values(game.playersToRoles)
      .map((role) => getCharacter(role))
      .filter((character) => character.team === "Traveler");

    const allCharacters = [...charactersFromScript, ...travelerCharacters];

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
        Traveler: allCharacters.filter(({ team }) => team === "Traveler"),
      } satisfies Record<CharacterType, Character[]>,
    ];
  }, [script, game]);

  return (
    <Tabs.Root
      className="flex flex-1 flex-col overflow-hidden"
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

      <Tabs.Content className="flex-1 overflow-y-auto" value="script">
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
                {characters.map((char) => (
                  <Flex key={char.id} gap="2">
                    <Flex direction="column">
                      {/* <img src={char.imageSrc} className="h-5 w-5" /> */}
                      <Heading
                        size="2"
                        className="flex-1"
                        color={colorMap[team as CharacterType]}
                      >
                        <CharacterName role={char.id} />
                      </Heading>
                      <Text size="1" weight="light" className="pl-5">
                        {char.ability}
                      </Text>
                    </Flex>
                  </Flex>
                ))}
              </React.Fragment>
            ))}
        </Flex>
      </Tabs.Content>

      <Tabs.Content className="flex-1 overflow-y-auto" value="night-order">
        <Flex className="m-2" direction="column" gap="3">
          {nightOrder.map((character) => (
            <Flex key={character.id} gap="2">
              <Flex direction="column">
                {/* <img src={char.imageSrc} className="h-5 w-5" /> */}
                <Heading size="2" className="flex-1">
                  <CharacterName role={character.id} />
                </Heading>
                <Text size="1" weight="light" className="pl-5">
                  {character.ability}
                </Text>
              </Flex>
            </Flex>
          ))}
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
                    {getCharacter(game.playersToRoles[player]).ability}
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
