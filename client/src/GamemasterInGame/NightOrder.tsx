import React from "react";
import { IngamePlayerList, NightPlayerList } from "./PlayerList";
import { Button, Flex, Separator, Switch, Tabs } from "@radix-ui/themes";
import { useDefiniteGame } from "../store/GameContext";
import { GameMasterActions } from "./GameMasterActions";
import { useSetGameStatus } from "../store/actions/gmActions";
import { BsFillMoonStarsFill, BsSunFill } from "react-icons/bs";
import { GiNotebook } from "react-icons/gi";
import { AiOutlineMenu } from "react-icons/ai";
import { PlayerMessage, PlayerMessageProps } from "../PlayerMessagePage";
import classNames from "classnames";
import { Reveal } from "@hidden-identity/server";

export function NightOrder() {
  const { game } = useDefiniteGame();

  const [, , , setGameStatus] = useSetGameStatus();
  const [selectedTab, setSelectedTab] = React.useState("grimoir");
  const [lockTabs, setLockTabs] = React.useState(false);
  const [night, setNight] = React.useState(1);

  const [playerMessage, setPlayerMessage] = React.useState("");
  const [playerReveal, setPlayerReveal] = React.useState<
    Record<string, Reveal[]>
  >({});

  const [checkedActions, setCheckedActions] = React.useState<
    Record<string, boolean>
  >({});

  const nextNight = () => {
    if (game.gameStatus === "Setup") {
      setGameStatus("Started");
    }
    setCheckedActions({});
    setNight((prev) => prev + 1);
  };

  const openPlayerMessage = ({ message, reveal }: PlayerMessageProps) => {
    setPlayerMessage(message);
    reveal && setPlayerReveal(reveal);
    setSelectedTab("message");
    setLockTabs(true);
  };

  return (
    <Tabs.Root
      className="flex flex-1 flex-col overflow-hidden"
      value={selectedTab}
      onValueChange={setSelectedTab}
    >
      <Tabs.List>
        <Tabs.Trigger className="flex-1" disabled={lockTabs} value="grimoir">
          <Flex align="center" gap="1">
            <BsSunFill />
            {selectedTab === "grimoir" && "Grimoir"}
          </Flex>
        </Tabs.Trigger>
        <Tabs.Trigger className="flex-1" disabled={lockTabs} value="night">
          <Flex align="center" gap="1">
            <BsFillMoonStarsFill />
            {selectedTab === "night" && "Night"}
          </Flex>
        </Tabs.Trigger>
        <Tabs.Trigger className="flex-1" disabled={lockTabs} value="message">
          <Flex align="center" gap="1">
            <GiNotebook />
            {selectedTab === "message" && "Message"}
          </Flex>
        </Tabs.Trigger>
        <Tabs.Trigger className="flex-1" disabled={lockTabs} value="menu">
          <Flex align="center" gap="1">
            <AiOutlineMenu />
            {selectedTab === "menu" && "Menu"}
          </Flex>
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content className="flex-1 overflow-y-auto" value="grimoir">
        <IngamePlayerList />
      </Tabs.Content>

      <Tabs.Content
        forceMount
        className={classNames(
          "flex-1 overflow-y-auto",
          selectedTab !== "night" && "hidden",
        )}
        value="night"
      >
        <Flex direction="column" mt="2">
          <Flex justify="between" align="center" mx="3">
            <Flex gap="3">
              <span>Night</span>
              <span>{night}</span>
            </Flex>
            <Button onClick={nextNight}>Next Night</Button>
          </Flex>
          <Separator size="4" mt="2" />
          <NightPlayerList
            firstNight={night === 1}
            checkedActions={checkedActions}
            setCheckedActions={setCheckedActions}
            openPlayerMessage={openPlayerMessage}
          />
        </Flex>
      </Tabs.Content>

      <Tabs.Content className="flex-1 overflow-y-auto" value="message">
        <Flex direction="column">
          <label>
            <Flex justify="between">
              Lock Interface
              <Switch
                checked={lockTabs}
                onChange={() => setLockTabs((prev) => !prev)}
              />
            </Flex>
          </label>
          <PlayerMessage message={playerMessage} reveal={playerReveal} />
        </Flex>
      </Tabs.Content>

      <Tabs.Content className="flex-1 overflow-y-auto" value="menu">
        <GameMasterActions selectedRoles={{}} />
      </Tabs.Content>

      {/* <Flex gap="2" direction="column" p="2" className="w-full">
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
      </Flex> */}
    </Tabs.Root>
  );
}
