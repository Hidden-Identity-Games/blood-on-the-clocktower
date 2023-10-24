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

export function NightOrder() {
  const { game } = useDefiniteGame();

  const [, , , setGameStatus] = useSetGameStatus();
  const [selectedTab, setSelectedTab] = React.useState("grimoir");
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
    setSelectedTab("grimoir");
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
      onValueChange={setSelectedTab}
    >
      <Tabs.List>
        <Tabs.Trigger
          className="flex-1"
          disabled={interfaceLocked}
          value="grimoir"
        >
          <Flex align="center" gap="1">
            {interfaceLocked ? <BiSolidLock /> : <GiOpenBook />}
            {selectedTab === "grimoir" && "Grimoir"}
          </Flex>
        </Tabs.Trigger>
        <Tabs.Trigger
          className="flex-1"
          disabled={interfaceLocked}
          value="night"
        >
          <Flex align="center" gap="1">
            {interfaceLocked ? <BiSolidLock /> : <BsFillMoonStarsFill />}
            {selectedTab === "night" && (firstNight ? "First Night" : "Night")}
          </Flex>
        </Tabs.Trigger>
        <Tabs.Trigger
          className="flex-1"
          disabled={interfaceLocked}
          value="message"
        >
          <Flex align="center" gap="1">
            <GiNotebook />
            {selectedTab === "message" && "Message"}
          </Flex>
        </Tabs.Trigger>
        <Tabs.Trigger
          className="flex-1"
          disabled={interfaceLocked}
          value="menu"
        >
          <Flex align="center" gap="1">
            {interfaceLocked ? <BiSolidLock /> : <AiOutlineMenu />}
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
            playerMessageCallback={openPlayerMessage}
          />
        </Flex>
      </Tabs.Content>

      <Tabs.Content className="flex-1 overflow-y-auto" value="message">
        <Flex className="h-5/6" direction="column" gap="1" my="3">
          <Flex justify="end" align="center" mx="3">
            <label>
              <Flex align="center" gap="3">
                <Flex align="center" gap="2">
                  {interfaceLocked ? <BiSolidLock /> : <BiSolidLockOpen />}
                  Lock Interface
                </Flex>
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
          <Flex justify="end" mx="3">
            <Button
              variant="soft"
              disabled={interfaceLocked}
              onClick={() => {
                openPlayerMessage("", {});
                setInterfaceLocked(false);
              }}
            >
              Clear Note
            </Button>
          </Flex>
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
