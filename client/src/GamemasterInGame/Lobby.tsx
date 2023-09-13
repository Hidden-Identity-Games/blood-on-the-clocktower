import { Flex, Tabs, Text } from "@radix-ui/themes";
import {
  CharacterSelectList,
  useCharacterSelectState,
} from "./CharacterSelectList";
import { useDefiniteGame } from "../store/GameContext";
import TeamDistributionBar from "./TeamDistributionBar";
import { Role } from "@hidden-identity/server";
import "./Lobby.css";
import { GameMasterActions } from "./GameMasterActions";
import { BsPeopleFill } from "react-icons/bs";
import { FaMasksTheater } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PlayerList } from "./PlayerList";

export interface LobbyProps {
  rolesList: Role[];
}

export function Lobby({ rolesList }: LobbyProps) {
  const { game } = useDefiniteGame();
  const [selectedTab, setSelectedTab] = useState<string>("roles");

  const characterSelectState = useCharacterSelectState(rolesList);
  const assignedRoles = Object.values(game.playersToRoles);

  return (
    <Flex
      gap="0"
      pt="1"
      direction="column"
      className="flex flex-1 flex-col overflow-y-auto"
    >
      <TeamDistributionBar
        charsSelected={
          game.gameStarted
            ? assignedRoles
            : Object.entries(characterSelectState.selectedRoles.value)
                .filter(([_, value]) => !!value)
                .map(([key]) => key)
        }
      />
      <Tabs.Root
        className="tab-root"
        value={selectedTab}
        onValueChange={(e) => setSelectedTab(e)}
      >
        <Tabs.List>
          <Tabs.Trigger className="tab-trigger" value="players">
            <Text className="mr-1">
              Players ({Object.keys(game.playersToRoles).length})
            </Text>
            <Text color="red" asChild>
              <BsPeopleFill />
            </Text>
          </Tabs.Trigger>
          <Tabs.Trigger className="tab-trigger" value="roles">
            <Text className="mr-1">
              Roles(
              {Object.keys(characterSelectState.selectedRoles.value).length})
            </Text>
            <Text color="red" asChild>
              <FaMasksTheater />
            </Text>
          </Tabs.Trigger>
        </Tabs.List>
        <div className="relative flex-1">
          <AnimatePresence>
            {selectedTab === "players" && (
              <motion.div
                className="absolute h-full w-full"
                key="players"
                initial={{ x: "100%", opacity: 0.3 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0.3 }}
                transition={{ type: "tween" }}
              >
                <Tabs.Content
                  forceMount
                  className="tab-content overflow-x-hidden"
                  value="players"
                >
                  <Flex
                    direction="column"
                    py="3"
                    gap="2"
                    style={{ overflowY: "auto" }}
                  >
                    <GameMasterActions
                      selectedRoles={characterSelectState.selectedRoles.value}
                    />
                    <PlayerList />
                  </Flex>
                </Tabs.Content>
              </motion.div>
            )}
            {selectedTab === "roles" && (
              <motion.div
                className="absolute h-full w-full"
                key="roles"
                initial={{ x: "-100%", opacity: 0.3 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0.3 }}
                transition={{ type: "tween" }}
              >
                <Tabs.Content
                  forceMount
                  className="tab-content h-full"
                  value="roles"
                >
                  <CharacterSelectList
                    state={characterSelectState}
                    readOnly={game.gameStarted}
                  />
                </Tabs.Content>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Tabs.Root>
    </Flex>
  );
}
