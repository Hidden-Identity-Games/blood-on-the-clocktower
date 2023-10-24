import React from "react";
import { IngamePlayerList, NightPlayerList } from "./PlayerList";
import { Flex, Switch, Tabs } from "@radix-ui/themes";
import { useDefiniteGame } from "../store/GameContext";
import { GameMasterActions } from "./GameMasterActions";
import { useSetGameStatus } from "../store/actions/gmActions";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { GiNotebook, GiOpenBook } from "react-icons/gi";
import { AiOutlineMenu } from "react-icons/ai";
import { PlayerMessage } from "../PlayerMessagePage";
import classNames from "classnames";
import { Reveal } from "@hidden-identity/server";

export function NightOrder() {
  const { game } = useDefiniteGame();

  const [, , , setGameStatus] = useSetGameStatus();
  const [selectedTab, setSelectedTab] = React.useState("grimoir");
  const [lockTabs, setLockTabs] = React.useState(false);

  const [playerMessage, setPlayerMessage] = React.useState("");
  const [playerReveal, setPlayerReveal] = React.useState<
    Record<string, Reveal[]>
  >({});

  const firstNight = game.gameStatus === "Setup";

  const startDay = () => {
    if (game.gameStatus === "Setup") {
      setGameStatus("Started");
    }
    setSelectedTab("grimoir");
  };

  const openPlayerMessage = (
    message: string,
    reveal: Record<string, Reveal[]>,
  ) => {
    setPlayerMessage(message);
    setPlayerReveal(reveal ?? {});
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
            <GiOpenBook />
            {selectedTab === "grimoir" && "Grimoir"}
          </Flex>
        </Tabs.Trigger>
        <Tabs.Trigger className="flex-1" disabled={lockTabs} value="night">
          <Flex align="center" gap="1">
            <BsFillMoonStarsFill />
            {selectedTab === "night" && (firstNight ? "First Night" : "Night")}
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
          <NightPlayerList
            firstNight={firstNight}
            endNightCallback={startDay}
          />
        </Flex>
      </Tabs.Content>

      <Tabs.Content className="flex-1 overflow-y-auto" value="message">
        <Flex direction="column" my="2">
          <Flex justify="end">
            <label>
              <Flex align="center" gap="3" mx="3">
                Lock Interface
                <Switch
                  checked={lockTabs}
                  onClick={() => setLockTabs((prev) => !prev)}
                  radius="full"
                />
              </Flex>
            </label>
          </Flex>
          <PlayerMessage
            message={playerMessage}
            reveal={playerReveal}
            onMessageChange={(newMessage: string) =>
              openPlayerMessage(newMessage, playerReveal)
            }
          />
        </Flex>
      </Tabs.Content>

      <Tabs.Content className="flex-1 overflow-y-auto" value="menu">
        <Flex className="h-full w-full" direction="column" justify="center">
          <GameMasterActions selectedRoles={{}} />
        </Flex>
      </Tabs.Content>
    </Tabs.Root>
  );
}
