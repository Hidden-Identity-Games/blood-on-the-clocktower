import { Button, Flex, Tabs, Text } from "@radix-ui/themes";
import {
  CharacterSelectList,
  useCharacterSelectState,
} from "./CharacterSelectList";
import { useDefiniteGame } from "../store/GameContext";
import { useKickPlayer } from "../store/useStore";
import TeamDistributionBar from "./TeamDistributionBar";
import { Role } from "@hidden-identity/server";
import "./Lobby.css";
import { RoleIcon, RoleName, RoleText } from "../shared/RoleIcon";
import { GameMasterActions } from "./GameMasterActions";
import { BsPeopleFill } from "react-icons/bs";
import { FaMasksTheater } from "react-icons/fa6";
import classNames from "classnames";

export interface LobbyProps {
  rolesList: Role[];
}

export function Lobby({ rolesList }: LobbyProps) {
  const { game } = useDefiniteGame();
  const [, kickPlayerLoading, , handleKickPlayer] = useKickPlayer();

  const characterSelectState = useCharacterSelectState(rolesList);
  const assignedRoles = Object.values(game.playersToRoles);
  const seatingProblems =
    game.orderedPlayers.problems && game.orderedPlayers.playerProblems;

  return (
    <Flex gap="0" pt="1" className="flex flex-1 flex-col overflow-y-auto">
      <TeamDistributionBar
        charsSelected={
          game.gameStarted
            ? assignedRoles
            : Object.entries(characterSelectState.selectedRoles.value)
                .filter(([_, value]) => !!value)
                .map(([key]) => key)
        }
      />
      <Tabs.Root className="tab-root" defaultValue="roles">
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

        <Tabs.Content className="tab-content" value="roles" style={{ flex: 1 }}>
          <Flex direction="column" gap="3" py="3">
            <CharacterSelectList
              state={characterSelectState}
              readOnly={game.gameStarted}
            />
          </Flex>
        </Tabs.Content>
        <Tabs.Content className="tab-content" value="players">
          <Flex direction="column" py="3" gap="2" style={{ overflowY: "auto" }}>
            <GameMasterActions
              selectedRoles={characterSelectState.selectedRoles.value}
            />
            {Object.entries(game.playersToRoles).length === 0 && (
              <Text as="div" className="m-5 text-center">
                No players have joined yet. Share the game by clicking the game
                code.
              </Text>
            )}
            {Object.entries(game.playersToRoles).map(([player, role]) => (
              <Flex
                justify="between"
                align="center"
                px="3"
                gap="3"
                key={player}
                asChild
              >
                <Text size="2">
                  <RoleText className="flex-1" role={role}>
                    {player}
                  </RoleText>
                  <RoleIcon
                    role={role}
                    className={classNames("h-4", {
                      ["opacity-0"]: role === "unassigned",
                    })}
                  />
                  {seatingProblems ? (
                    <Text as="div">
                      {seatingProblems[player] ? "Getting settled" : "Ready"}
                    </Text>
                  ) : (
                    <div
                      className="truncate capitalize"
                      style={{
                        flex: 2,
                      }}
                    >
                      {RoleName(role)}
                    </div>
                  )}

                  {!game.gameStarted && (
                    <Button
                      disabled={kickPlayerLoading}
                      size="1"
                      onClick={() => handleKickPlayer(player)}
                    >
                      {kickPlayerLoading ? "Kicking..." : "Kick"}
                    </Button>
                  )}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Tabs.Content>
      </Tabs.Root>
    </Flex>
  );
}
