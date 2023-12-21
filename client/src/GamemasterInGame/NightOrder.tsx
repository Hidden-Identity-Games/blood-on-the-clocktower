import React from "react";
import { IngamePlayerList } from "./PlayerLists/GMPlayerList";
import { NightPlayerList } from "./PlayerLists/NightPlayerList";
import { Button, Flex, Switch, Tabs } from "@radix-ui/themes";
import { useDefiniteGame } from "../store/GameContext";
import { GameMasterActions } from "./GameMasterActions";
import { useSetGameStatus } from "../store/actions/gmActions";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { GiNotebook, GiOpenBook } from "react-icons/gi";
import { AiOutlineMenu } from "react-icons/ai";
import classNames from "classnames";
import { BiSolidLock, BiSolidLockOpen } from "react-icons/bi";
import { ScriptList } from "../shared/ScriptList";
import { PlayerOrder } from "../shared/PlayerListOrder";
import { useClearVotesToExecute } from "../store/actions/gmPlayerActions";
import { PlayerMessagesTab } from "./PlayerMessagesTab";

type Tabs = "grimoire" | "night" | "message" | "menu";
export function NightOrder() {
  const { game } = useDefiniteGame();

  const [, , , setGameStatus] = useSetGameStatus();
  const [selectedTab, setSelectedTab] = React.useState<Tabs>("grimoire");
  const [interfaceLocked, setInterfaceLocked] = React.useState(false);

  const [selectedOrder, setSelectedOrder] =
    React.useState<PlayerOrder>("alphabetical");

  const [, , , clearVotesToExecute] = useClearVotesToExecute();

  const firstNight = game.gameStatus === "Setup";

  const startDay = () => {
    if (game.gameStatus === "Setup") {
      setGameStatus("Started");
    }
    setSelectedTab("grimoire");
    clearVotesToExecute();
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
          heading="Menu"
          selectedTab={selectedTab}
          isLocked={interfaceLocked}
        >
          <AiOutlineMenu />
        </LockableTabTrigger>
      </Tabs.List>

      <Tabs.Content className="flex-1 overflow-y-auto" value="grimoire">
        <IngamePlayerList
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
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
          />
        </Flex>
      </Tabs.Content>

      <Tabs.Content className="flex-1 overflow-y-auto" value="message">
        <Flex className="h-5/6" direction="column" gap="1" my="3">
          <Flex justify="between" align="center" mx="2">
            <Button variant="soft">Clear</Button>
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
          <PlayerMessagesTab />
        </Flex>
      </Tabs.Content>

      <Tabs.Content className="flex-1 overflow-y-auto" value="menu">
        <Flex className="h-full" direction="column" gap="2" m="3">
          <GameMasterActions gameStartable={false} availableRolesList={[]} />
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
    <Tabs.Trigger
      className="flex-1"
      disabled={isLocked}
      value={value}
      aria-label={value}
    >
      <Flex align="center" gap="1">
        {isLocked && selectedTab !== value ? <BiSolidLock /> : children}
        {selectedTab === value && heading}
      </Flex>
    </Tabs.Trigger>
  );
}
