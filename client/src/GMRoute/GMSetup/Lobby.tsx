import { Flex, Tabs, Text } from "@radix-ui/themes";
import {
  CharacterSelectList,
  useCharacterSelectState,
} from "./CharacterSelectList";
import { useDefiniteGame } from "../../store/GameContext";
import { TeamDistributionBar } from "../../shared/TeamDistributionBar";
import { Role } from "@hidden-identity/shared";
import { GameMasterActions } from "../GMShared/GameMasterActions";
import { BsPeopleFill } from "react-icons/bs";
import { FaMasksTheater } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { SetupPlayerList } from "./SetupPlayerList";
import { AiOutlineMenu } from "react-icons/ai";

export interface LobbyProps {
  rolesList: Role[];
}

export function Lobby() {
  const { game, script } = useDefiniteGame();
  const [selectedTab, setSelectedTab] = useState<string>("roles");

  const characterSelectState = useCharacterSelectState(
    script.map(({ id }) => id),
  );

  const availableRolesList = Object.entries(
    characterSelectState.selectedRoles.value,
  ).flatMap(([role, qty]) =>
    Array.from({ length: qty }).map(() => role),
  ) as Role[];

  const gameStartable =
    availableRolesList.length !== 0 &&
    !game.orderedPlayers.problems &&
    availableRolesList.length === game.orderedPlayers.fullList.length;

  return (
    <Flex
      gap="3"
      pt="1"
      direction="column"
      className="flex flex-1 flex-col overflow-y-auto"
    >
      <TeamDistributionBar
        charsSelected={
          Object.entries(characterSelectState.selectedRoles.value).flatMap(
            ([role, qty]) => Array.from({ length: qty }).map(() => role),
          ) as Role[]
        }
      />
      <Tabs.Root
        className="flex flex-1 flex-col"
        value={selectedTab}
        onValueChange={(e) => setSelectedTab(e)}
      >
        <Tabs.List>
          <Tabs.Trigger
            className="max-w-[200px] flex-1"
            value="players"
            aria-label="players"
          >
            <Text color="red" asChild>
              <BsPeopleFill />
            </Text>
            <Text className="ml-1">
              {selectedTab === "players" && "Players"} (
              {Object.keys(game.playersToRoles).length})
            </Text>
          </Tabs.Trigger>

          <Tabs.Trigger
            className="max-w-[200px] flex-1"
            value="roles"
            aria-label="role"
          >
            <Text color="red" asChild>
              <FaMasksTheater />
            </Text>
            <Text className="ml-1">
              {selectedTab === "roles" && "Roles"}(
              {Object.values(characterSelectState.selectedRoles.value).reduce(
                (sum, qty) => sum + qty,
                0,
              )}
              )
            </Text>
          </Tabs.Trigger>
          <Tabs.Trigger
            className="max-w-[200px] flex-1"
            value="menu"
            aria-label="menu"
          >
            <Text color="red" asChild>
              <AiOutlineMenu />
            </Text>
            <Text className="ml-1">{selectedTab === "menu" && "Menu"}</Text>
          </Tabs.Trigger>
        </Tabs.List>
        <div className="relative flex-1 overflow-x-hidden">
          <AnimatePresence>
            {selectedTab === "players" && (
              <motion.div
                className="absolute h-full w-full"
                key="players"
                initial={{ x: "-100%", opacity: 0.3 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0.3 }}
                transition={{ type: "tween" }}
              >
                <Tabs.Content
                  forceMount
                  className="h-full overflow-y-auto"
                  value="players"
                >
                  <Flex
                    direction="column"
                    py="3"
                    gap="2"
                    style={{ overflowY: "auto" }}
                  >
                    <SetupPlayerList />
                  </Flex>
                </Tabs.Content>
              </motion.div>
            )}
            {selectedTab === "roles" && (
              <motion.div
                className="absolute h-full w-full"
                key="roles"
                initial={{ x: "100%", opacity: 0.3 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0.3 }}
                transition={{ type: "tween" }}
              >
                <Tabs.Content
                  forceMount
                  className="h-full overflow-y-auto"
                  value="roles"
                >
                  <CharacterSelectList state={characterSelectState} />
                </Tabs.Content>
              </motion.div>
            )}
            {selectedTab === "menu" && (
              <motion.div
                className="absolute h-full w-full"
                key="menu"
                initial={{ x: "100%", opacity: 0.3 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0.3 }}
                transition={{ type: "tween" }}
              >
                <Tabs.Content
                  forceMount
                  className="h-full overflow-y-auto"
                  value="menu"
                >
                  <div className="p-2">
                    <GameMasterActions
                      gameStartable={gameStartable}
                      availableRolesList={availableRolesList}
                    />
                  </div>
                </Tabs.Content>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Tabs.Root>
    </Flex>
  );
}
