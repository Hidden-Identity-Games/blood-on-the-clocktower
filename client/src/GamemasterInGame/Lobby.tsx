import { Button, Flex, Tabs } from "@radix-ui/themes";
import {
  CharacterSelectList,
  useCharacterSelectState,
} from "./CharacterSelectList";
import { useGame } from "../store/GameContext";
import { useDistributeRoles, usePlayerNamesToRoles } from "../store/useStore";
import TeamDistributionBar from "./TeamDistributionBar";
import { useState } from "react";

function StartGameButton({
  onClick,
  isLoading,
  disabled,
  gameStarted,
}: {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
  gameStarted?: boolean;
}) {
  if (gameStarted) {
    return <div>Game has started.</div>;
  }
  return (
    <Button disabled={disabled} onClick={onClick}>
      {isLoading ? "Doing some work..." : "Distribute Roles"}
    </Button>
  );
}
export function Lobby() {
  const { game } = useGame();
  const playersToRoles = usePlayerNamesToRoles();
  const [selectedTab, setSelectedTab] = useState<"roles" | "players">("roles");
  const [distributeRolesError, isLoading, , distributeRoles, clear] =
    useDistributeRoles();

  const characterSelectState = useCharacterSelectState();
  const availableRolesList = Object.entries(
    characterSelectState.selectedRoles.value,
  )
    .filter(([, value]) => value)
    .map(([key]) => key);

  const gameStartable =
    availableRolesList.length === Object.keys(playersToRoles).length;

  if (!game) {
    return <div>Loading...</div>;
  }
  if (distributeRolesError) {
    return (
      <>
        <div>Something went wrong, please check with players and try again</div>
        <div>{distributeRolesError}</div>
        <Button onClick={clear}>Try again</Button>
      </>
    );
  }

  return (
    <Tabs.Root
      defaultValue="roles"
      value={game?.gameStarted ? "players" : selectedTab}
      onValueChange={(e) => setSelectedTab(e as "roles" | "players")}
    >
      <Tabs.List>
        <Tabs.Trigger disabled={game.gameStarted} value="roles">
          Roles
        </Tabs.Trigger>
        <Tabs.Trigger value="players">
          Players ({Object.keys(game.playersToNames).length})
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="roles">
        <Flex direction="column" gap="3" py="3">
          <CharacterSelectList state={characterSelectState} />
          <TeamDistributionBar
            charsSelected={characterSelectState.characters.filter(
              ({ name }) => characterSelectState.selectedRoles.value[name],
            )}
          />
        </Flex>

        <StartGameButton
          disabled={!gameStartable}
          gameStarted={game.gameStarted}
          isLoading={isLoading}
          onClick={() => distributeRoles(availableRolesList)}
        />
      </Tabs.Content>
      <Tabs.Content value="players">
        <Flex direction="column" py="3" style={{ overflowY: "auto" }}>
          {Object.entries(playersToRoles).length === 0 &&
            "No players joined yet."}
          {Object.entries(playersToRoles).map(([name, role]) => (
            <Flex justify="between" px="3" key={name}>
              <div>{name}</div>
              <div>{role || "Not yet assigned"}</div>
            </Flex>
          ))}
        </Flex>
        <StartGameButton
          disabled={!gameStartable}
          gameStarted={game.gameStarted}
          isLoading={isLoading}
          onClick={() => distributeRoles(availableRolesList)}
        />
      </Tabs.Content>
    </Tabs.Root>
  );
}
