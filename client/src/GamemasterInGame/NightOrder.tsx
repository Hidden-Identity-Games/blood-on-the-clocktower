import React from "react";
import { IngamePlayerList, NightPlayerList } from "./PlayerList";
import { Button, Flex, Switch, Tabs } from "@radix-ui/themes";
import { useDefiniteGame } from "../store/GameContext";
import { GameMasterActions } from "./GameMasterActions";
import { useSetGameStatus } from "../store/actions/gmActions";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { GiNotebook, GiOpenBook } from "react-icons/gi";
import { AiOutlineMenu } from "react-icons/ai";
import { PlayerMessage } from "../PlayerMessagePage";
import classNames from "classnames";
import { Reveal } from "@hidden-identity/server";
import { BiSolidLock, BiSolidLockOpen } from "react-icons/bi";
import { ScriptList } from "../shared/ScriptList";

type Tabs = "grimoire" | "night" | "message" | "menu";
export function NightOrder() {
  const { game } = useDefiniteGame();

  const [, , , setGameStatus] = useSetGameStatus();
  const [selectedTab, setSelectedTab] = React.useState<Tabs>("grimoire");
  const [interfaceLocked, setInterfaceLocked] = React.useState(false);

  const [playerMessage, setPlayerMessage] = React.useState("");
  const [playerReveal, setPlayerReveal] = React.useState<
    Record<string, Reveal[]>
  >({});

  const firstNight = game.gameStatus === "Setup";

  const startDay = () => {
    if (game.gameStatus === "Setup") {
      setGameStatus("Started");
    }
    setSelectedTab("grimoire");
  };

  const openPlayerMessage = (
    message: string,
    reveal: Record<string, Reveal[]>,
  ) => {
    setPlayerMessage(message);
    setPlayerReveal(reveal ?? null);
    setSelectedTab("message");
    setInterfaceLocked(true);
  };

  return (
    <Tabs.Root
      className="flex flex-1 flex-col overflow-hidden"
      value={selectedTab}
      onValueChange={(tab) => setSelectedTab(tab as Tabs)}
    >
      <Tabs.List>
        <LockableTabTrigger
          value="grimoire"
          heading="Grimoire"
          selectedTab={selectedTab}
          isLocked={interfaceLocked}
        >
          <GiOpenBook />
        </LockableTabTrigger>
        <LockableTabTrigger
          value="night"
          heading={firstNight ? "First Night" : "Night"}
          selectedTab={selectedTab}
          isLocked={interfaceLocked}
        >
          <BsFillMoonStarsFill />
        </LockableTabTrigger>
        <LockableTabTrigger
          value="message"
          heading="Message"
          selectedTab={selectedTab}
          isLocked={interfaceLocked}
        >
          <GiNotebook />
        </LockableTabTrigger>
        <LockableTabTrigger
          value="menu"
          heading="Menu & Script"
          selectedTab={selectedTab}
          isLocked={interfaceLocked}
        >
          <AiOutlineMenu />
        </LockableTabTrigger>
      </Tabs.List>

      <Tabs.Content className="flex-1 overflow-y-auto" value="grimoire">
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
          <NightPlayerList
            firstNight={firstNight}
            endNightCallback={startDay}
            playerMessageCallback={openPlayerMessage}
          />
        </Flex>
      </Tabs.Content>

      <Tabs.Content className="flex-1 overflow-y-auto" value="message">
        <Flex className="h-5/6" direction="column" gap="1" my="3">
          <Flex justify="between" align="center" mx="2">
            <Button
              variant="soft"
              disabled={interfaceLocked}
              onClick={() => {
                openPlayerMessage("", {});
                setInterfaceLocked(false);
              }}
            >
              Clear
            </Button>
            <label>
              <Flex align="center" gap="2">
                {interfaceLocked ? <BiSolidLock /> : <BiSolidLockOpen />}
                Lock Interface
                <Switch
                  checked={interfaceLocked}
                  onClick={() => setInterfaceLocked((prev) => !prev)}
                  radius="full"
                />
              </Flex>
            </label>
          </Flex>
          <PlayerMessage
            message={playerMessage}
            reveal={playerReveal ?? {}}
            onMessageChange={openPlayerMessage}
          />
        </Flex>
      </Tabs.Content>

      <Tabs.Content className="flex-1 overflow-y-auto" value="menu">
        <Flex className="h-full" direction="column" gap="2" m="3">
          <GameMasterActions selectedRoles={{}} />
          <ScriptList className="my-5" />
        </Flex>
      </Tabs.Content>
    </Tabs.Root>
  );
}

interface LockableTabTriggerProps {
  value: string;
  heading: string;
  selectedTab: Tabs;
  isLocked: boolean;
  children: React.ReactNode;
}
function LockableTabTrigger({
  value,
  heading,
  selectedTab,
  isLocked,
  children,
}: LockableTabTriggerProps) {
  return (
    <Tabs.Trigger className="flex-1" disabled={isLocked} value={value}>
      <Flex align="center" gap="1">
        {isLocked && selectedTab !== value ? <BiSolidLock /> : children}
        {selectedTab === value && heading}
      </Flex>
    </Tabs.Trigger>
  );
}
