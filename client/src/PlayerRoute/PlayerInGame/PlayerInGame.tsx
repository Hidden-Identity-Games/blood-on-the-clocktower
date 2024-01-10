import { getCharacter } from "@hidden-identity/shared";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Separator,
  Tabs,
  Text,
} from "@radix-ui/themes";
import classNames from "classnames";
import React, { useState } from "react";
import { BsFillMoonStarsFill, BsPeopleFill } from "react-icons/bs";
import { GiAxeInStump, GiScrollQuill } from "react-icons/gi";
import { LiaVoteYeaSolid } from "react-icons/lia";

import { ForPlayerPlayerRoleIcon } from "../../GMRoute/GMShared/PlayerListComponents/PlayerRole";
import { ExecutionInfo } from "../../shared/ExecutionInfo";
import { MeaningfulIcon } from "../../shared/MeaningfulIcon";
import {
  type PlayerFilter,
  PlayerListFilters,
  usePlayerFilters,
} from "../../shared/PlayerListFilters";
import {
  PlayerListOrder,
  type PlayerOrder,
  usePlayerOrder,
} from "../../shared/PlayerListOrder";
import { CharacterName } from "../../shared/RoleIcon";
import { ScriptList } from "../../shared/ScriptList";
import { SetCountModal } from "../../shared/SetCount";
import { TeamDistributionBar } from "../../shared/TeamDistributionBar";
import { useVotesToExecute } from "../../store/actions/gmPlayerActions";
import { useDefiniteGame } from "../../store/GameContext";
import { useFirstSeat } from "../../store/url";
import { useMe } from "../../store/usePlayer";

export function PlayerInGame() {
  const { game } = useDefiniteGame();
  const { script } = game;
  const me = useMe();
  const [selectedTab, setSelectedTab] = React.useState("script");
  const [selectedOrder, setSelectedOrder] =
    useState<PlayerOrder>("alphabetical");
  const [firstSeat] = useFirstSeat();
  const orderedPlayers = usePlayerOrder(selectedOrder, firstSeat);
  const allFilters = usePlayerFilters(orderedPlayers);
  const [selectedFilter, setSelectedFilter] = useState<PlayerFilter>("all");
  const filteredPlayers = allFilters[selectedFilter];
  const [isFirstNightSort, setIsFirstNightSort] = React.useState(false);
  const [, , , setVotesToExecute] = useVotesToExecute();

  const nightOrder = React.useMemo(() => {
    const charactersFromScript =
      script?.map(({ id }) => getCharacter(id)) ?? [];
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
          <TeamDistributionBar />
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
            <Flex justify="between" p="2" direction="column">
              <ExecutionInfo />
            </Flex>

            <PlayerListFilters
              allFilters={allFilters}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
            <PlayerListOrder
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
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
              <Flex key={player} gap="1" align="center">
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
                <Flex
                  justify="start"
                  gap="3"
                  className={classNames(
                    "flex-1",
                    game.deadPlayers[player] && "line-through",
                  )}
                >
                  <Text
                    color={game.travelers[player] ? "amber" : undefined}
                    as="div"
                    className="capitalize"
                  >
                    {player}
                  </Text>
                  {game.travelers[player] && (
                    <ForPlayerPlayerRoleIcon player={player}>
                      {getCharacter(game.playersToRoles[player]).ability}
                    </ForPlayerPlayerRoleIcon>
                  )}
                </Flex>
                {game.onTheBlock[player] && (
                  <Text
                    color={game.travelers[player] ? "amber" : undefined}
                    as="div"
                    className="capitalize"
                  >
                    Votes: {game.onTheBlock[player]}
                  </Text>
                )}
                <SetCountModal
                  title="Set votes to execute:"
                  onSet={(votes: number) =>
                    void setVotesToExecute(player, votes)
                  }
                  defaultValue={game.onTheBlock[player] ?? 0}
                >
                  <IconButton variant="soft" radius="large">
                    <GiAxeInStump />
                  </IconButton>
                </SetCountModal>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Tabs.Content>
    </Tabs.Root>
  );
}
