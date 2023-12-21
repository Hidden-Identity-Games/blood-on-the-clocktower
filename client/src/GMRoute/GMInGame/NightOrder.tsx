import { Flex, Tabs } from "@radix-ui/themes";
import classNames from "classnames";
import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { GiNotebook, GiOpenBook } from "react-icons/gi";

import { type PlayerOrder } from "../../shared/PlayerListOrder";
import { ScriptList } from "../../shared/ScriptList";
import { useSetGameStatus } from "../../store/actions/gmActions";
import { useClearVotesToExecute } from "../../store/actions/gmPlayerActions";
import { useDefiniteGame } from "../../store/GameContext";
import { GameMasterActions } from "../GMShared/GameMasterActions";
import { IngamePlayerList } from "./GMPlayerList";
import { NightPlayerList } from "./NightPlayerList";
import { PlayerMessagesTab } from "./PlayerMessagesTab";

type Tabs = "grimoire" | "night" | "message" | "menu";
export function NightOrder() {
  const { game } = useDefiniteGame();

  const [, , , setGameStatus] = useSetGameStatus();
  const [selectedTab, setSelectedTab] = React.useState<Tabs>("grimoire");

  const [selectedOrder, setSelectedOrder] =
    React.useState<PlayerOrder>("alphabetical");

  const [, , , clearVotesToExecute] = useClearVotesToExecute();

  const firstNight = game.gameStatus === "Setup";

  const startDay = () => {
    if (game.gameStatus === "Setup") {
      void setGameStatus("Started");
    }
    setSelectedTab("grimoire");
    void clearVotesToExecute();
  };

  return (
    <Tabs.Root
      className="flex flex-1 flex-col overflow-hidden"
      value={selectedTab}
      onValueChange={(tab) => setSelectedTab(tab as Tabs)}
    >
      <Tabs.List>
        <TabTrigger
          value="grimoire"
          heading="Grimoire"
          selectedTab={selectedTab}
        >
          <GiOpenBook />
        </TabTrigger>
        <TabTrigger
          value="night"
          heading={firstNight ? "First Night" : "Night"}
          selectedTab={selectedTab}
        >
          <BsFillMoonStarsFill />
        </TabTrigger>
        <TabTrigger value="message" heading="Message" selectedTab={selectedTab}>
          <GiNotebook />
        </TabTrigger>
        <TabTrigger value="menu" heading="Menu" selectedTab={selectedTab}>
          <AiOutlineMenu />
        </TabTrigger>
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

interface TabTriggerProps {
  value: string;
  heading: string;
  selectedTab: Tabs;
  children: React.ReactNode;
}
function TabTrigger({
  value,
  heading,
  selectedTab,
  children,
}: TabTriggerProps) {
  return (
    <Tabs.Trigger className="flex-1" value={value} aria-label={value}>
      <Flex align="center" gap="1">
        {children}
        {selectedTab === value && heading}
      </Flex>
    </Tabs.Trigger>
  );
}
