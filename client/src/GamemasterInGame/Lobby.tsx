import { Button, Flex, Tabs } from "@radix-ui/themes";
import {
  CharacterSelectList,
  useCharacterSelectState,
} from "./CharacterSelectList";
import { useGame } from "../store/GameContext";
import { useDistributeRoles, usePlayerNamesToRoles } from "../store/useStore";
import TeamDistributionBar from "./TeamDistributionBar";
import { useState } from "react";
import { ShareButton } from "./ShareButton";
import { useParams } from "react-router-dom";
import { Share1Icon } from "@radix-ui/react-icons";
import { Character } from "@hidden-identity/server";
import "./Lobby.css";
import { RoleIcon, RoleName } from "../shared/RoleIcon";

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

export interface LobbyProps {
  rolesList: Character[];
}

export function Lobby({ rolesList }: LobbyProps) {
  const { game } = useGame();
  const { gameId } = useParams();
  const playersToRoles = usePlayerNamesToRoles();
  const [selectedTab, setSelectedTab] = useState<"roles" | "players">(
    "players",
  );
  const [distributeRolesError, isLoading, , distributeRoles, clear] =
    useDistributeRoles();

  const characterSelectState = useCharacterSelectState(rolesList);
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
    <Flex gap="0" className="lobby">
      <TeamDistributionBar
        charsSelected={[
          ...characterSelectState.characters,
          ...characterSelectState.additionalCharacters.value,
        ].filter(({ id }) => characterSelectState.selectedRoles.value[id])}
      />
      <Tabs.Root
        value={game?.gameStarted ? "players" : selectedTab}
        onValueChange={(e) => setSelectedTab(e as "roles" | "players")}
        className="tab-root"
      >
        <Tabs.List>
          <Tabs.Trigger className="tab-trigger" value="players">
            Players ({Object.keys(game.playersToNames).length})
          </Tabs.Trigger>
          <Tabs.Trigger
            className="tab-trigger"
            disabled={game.gameStarted}
            value="roles"
          >
            Roles{game.gameStarted && "(Game started)"}
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content className="tab-content" value="roles" style={{ flex: 1 }}>
          <Flex direction="column" gap="3" py="3">
            <CharacterSelectList state={characterSelectState} />
          </Flex>
        </Tabs.Content>
        <Tabs.Content className="tab-content" value="players">
          <Flex direction="column" py="3" style={{ overflowY: "auto" }}>
            <Flex gap="2" direction="column">
              <StartGameButton
                disabled={!gameStartable}
                gameStarted={game.gameStarted}
                isLoading={isLoading}
                onClick={() => distributeRoles(availableRolesList)}
              />
              <ShareButton
                url={`${document.location.protocol}//${
                  document.location.hostname
                }${
                  document.location.port ? `:${document.location.port}` : ""
                }/${gameId}`}
                title="Join Game: Blood on the Clocktower"
                text="Join game: Blood on the Clocktower"
              >
                <Share1Icon /> Invite Players
              </ShareButton>
            </Flex>
            {Object.entries(playersToRoles).length === 0 &&
              "No players have joined yet."}
            {Object.entries(playersToRoles).map(([name, role]) => (
              <Flex justify="between" align="center" px="3" key={name}>
                <div>{name}</div>
                <div>{RoleName(role) ?? "Not yet assigned"}</div>
                <RoleIcon role={role} style={{ maxHeight: "3em" }} />
              </Flex>
            ))}
          </Flex>
        </Tabs.Content>
      </Tabs.Root>
    </Flex>
  );
}
