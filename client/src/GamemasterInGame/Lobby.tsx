import { Flex, Tabs, Text } from "@radix-ui/themes";
import {
  CharacterSelectList,
  useCharacterSelectState,
} from "./CharacterSelectList";
import { useDefiniteGame } from "../store/GameContext";
import TeamDistributionBar from "./TeamDistributionBar";
import { Role } from "@hidden-identity/server";
import { GameMasterActions } from "./GameMasterActions";
import { BsPeopleFill } from "react-icons/bs";
import { FaMasksTheater } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PregamePlayerList } from "./PlayerList";

export interface LobbyProps {
  rolesList: Role[];
}

export function Lobby() {
  const { game, script } = useDefiniteGame();
  const [selectedTab, setSelectedTab] = useState<string>("roles");

  const characterSelectState = useCharacterSelectState(
    script.map(({ id }) => id),
  );

  return (
    <Flex
      gap="3"
      pt="1"
      direction="column"
      className="flex flex-1 flex-col overflow-y-auto"
    >
      <GameMasterActions
        selectedRoles={characterSelectState.selectedRoles.value}
      />
      <TeamDistributionBar
        charsSelected={Object.entries(characterSelectState.selectedRoles.value)
          .filter(([_, value]) => !!value)
          .map(([key]) => key as Role)}
      />
      <Tabs.Root
        className="flex flex-1 flex-col"
        value={selectedTab}
        onValueChange={(e) => setSelectedTab(e)}
      >
        <Tabs.List>
          <Tabs.Trigger className="max-w-[200px] flex-1" value="players">
            <Text className="mr-1">
              Players ({Object.keys(game.playersToRoles).length})
            </Text>
            <Text color="red" asChild>
              <BsPeopleFill />
            </Text>
          </Tabs.Trigger>

          <Tabs.Trigger className="max-w-[200px] flex-1" value="roles">
            <Text className="mr-1">
              Roles(
              {
                Object.values(characterSelectState.selectedRoles.value).filter(
                  (selected) => selected,
                ).length
              }
              )
            </Text>
            <Text color="red" asChild>
              <FaMasksTheater />
            </Text>
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
                    <PregamePlayerList />
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
                  <CharacterSelectList
                    state={characterSelectState}
                    readOnly={false}
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
