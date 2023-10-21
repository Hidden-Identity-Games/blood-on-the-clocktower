import React from "react";
import { IngamePlayerList, NightPlayerList } from "./PlayerList";
import { Button, Flex, Tabs } from "@radix-ui/themes";
import { useDefiniteGame } from "../store/GameContext";
import { GameMasterActions } from "./GameMasterActions";
import { useSetGameStatus } from "../store/actions/gmActions";
import { BsFillMoonStarsFill, BsSunFill } from "react-icons/bs";
import { GiNotebook } from "react-icons/gi";
import { AiOutlineMenu } from "react-icons/ai";

export function NightOrder() {
  const { game } = useDefiniteGame();

  const [nightTime, setNightTime] = React.useState(false);
  const [, , , setGameStatus] = useSetGameStatus();
  const [selectedTab, setSelectedTab] = React.useState("");

  const startNight = () => {
    setNightTime(true);
  };

  return (
    <Tabs.Root
      className="flex flex-1 flex-col overflow-hidden"
      value={selectedTab}
      onValueChange={setSelectedTab}
    >
      <Tabs.List>
        <Tabs.Trigger className="flex-1" value="day">
          <BsSunFill />
          {selectedTab === "day" && "Day"}
        </Tabs.Trigger>
        <Tabs.Trigger className="flex-1" value="night">
          <BsFillMoonStarsFill />
          {selectedTab === "night" && "Night"}
        </Tabs.Trigger>
        <Tabs.Trigger className="flex-1" value="player-message">
          <GiNotebook />
          {selectedTab === "player-message" && "Player Message"}
        </Tabs.Trigger>
        <Tabs.Trigger className="flex-1" value="game-actions">
          <AiOutlineMenu />
          {selectedTab === "game-actions" && "Game Actions"}
        </Tabs.Trigger>
      </Tabs.List>

      <Flex gap="2" direction="column" p="2" className="w-full">
        {!nightTime && (
          <Button
            onClick={() => {
              startNight();
            }}
          >
            Start {game.gameStatus === "Started" ? "" : "first"} night
          </Button>
        )}
        {nightTime ? <NightPlayerList /> : <IngamePlayerList />}

        {nightTime && (
          <Button
            onClick={() => {
              if (game.gameStatus === "Setup") {
                setGameStatus("Started");
              }
              setNightTime(false);
            }}
          >
            Day time
          </Button>
        )}
        {nightTime ? (
          <Button
            onClick={() => {
              setGameStatus("Setup");
              setNightTime(false);
            }}
          >
            Back to first day
          </Button>
        ) : (
          <GameMasterActions selectedRoles={{}} />
        )}
      </Flex>
    </Tabs.Root>
  );
}
