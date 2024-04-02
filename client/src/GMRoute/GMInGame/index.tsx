import { Flex, Tabs } from "@radix-ui/themes";
import classNames from "classnames";
import { ScrollText } from "lucide-react";
import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { GiOpenBook } from "react-icons/gi";

import { type PlayerOrder } from "../../shared/PlayerListOrder";
import { ActionsTab } from "./Tabs/ActionsTab";
import { GrimoireCircleTab } from "./Tabs/GrimoireCircleTab";
import { GrimoireTab } from "./Tabs/GrimoireTab";
import { MenuTab } from "./Tabs/MenuTab";

type Tabs = "list-grimoire" | "night" | "grimoire-circle" | "menu";
export function GMInGame() {
  const [selectedTab, setSelectedTab] = React.useState<Tabs>("list-grimoire");

  const [selectedOrder, setSelectedOrder] =
    React.useState<PlayerOrder>("alphabetical");

  return (
    <Tabs.Root
      className="flex flex-1 flex-col overflow-hidden"
      value={selectedTab}
      onValueChange={(tab) => setSelectedTab(tab as Tabs)}
    >
      <Tabs.List>
        <TabTrigger
          value="grimoire-circle"
          heading="Grimoire"
          selectedTab={selectedTab}
          // hide if we're showing the big grimoire
          className="lg:hidden"
        >
          <GiOpenBook />
        </TabTrigger>
        <TabTrigger
          value="list-grimoire"
          heading="List"
          selectedTab={selectedTab}
        >
          <ScrollText />
        </TabTrigger>

        <TabTrigger value="night" heading="Actions" selectedTab={selectedTab}>
          <BsFillMoonStarsFill />
        </TabTrigger>
        <TabTrigger value="menu" heading="Menu" selectedTab={selectedTab}>
          <AiOutlineMenu />
        </TabTrigger>
      </Tabs.List>

      <Tabs.Content
        className={classNames(
          "flex flex-1 flex-col gap-2 overflow-y-auto pb-[80px] p-3",
          selectedTab !== "list-grimoire" && "hidden",
        )}
        value="list-grimoire"
      >
        <GrimoireTab
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      </Tabs.Content>

      <Tabs.Content
        forceMount
        className={classNames(
          "flex-1 overflow-y-auto flex flex-col gap-2 p-3 pb-[80px]",
          selectedTab !== "night" && "hidden",
        )}
        value="night"
      >
        <ActionsTab />
      </Tabs.Content>

      <Tabs.Content
        className={classNames(
          "flex flex-1 flex-col overflow-y-auto pb-[80px] p-3 divide-y",
          selectedTab !== "grimoire-circle" && "hidden",
        )}
        value="grimoire-circle"
      >
        <GrimoireCircleTab />
      </Tabs.Content>

      <Tabs.Content
        className={classNames(
          "flex flex-1 flex-col gap-2 overflow-y-auto pb-[80px] p-3",
          selectedTab !== "menu" && "hidden",
        )}
        value="menu"
      >
        <MenuTab />
      </Tabs.Content>
    </Tabs.Root>
  );
}

interface TabTriggerProps {
  value: string;
  heading: string;
  selectedTab: Tabs;
  children: React.ReactNode;
  className?: string;
}
function TabTrigger({
  value,
  heading,
  selectedTab,
  children,
  className,
}: TabTriggerProps) {
  return (
    <Tabs.Trigger
      className={classNames(className, "flex-1")}
      value={value}
      aria-label={value}
    >
      <Flex align="center" gap="1">
        {children}
        {selectedTab === value && heading}
      </Flex>
    </Tabs.Trigger>
  );
}
