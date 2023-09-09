import {
  Button,
  Dialog,
  DialogClose,
  Flex,
  IconButton,
  Tabs,
  Text,
} from "@radix-ui/themes";
import {
  CharacterSelectList,
  useCharacterSelectState,
} from "./CharacterSelectList";
import { useDefiniteGame, useGame } from "../store/GameContext";
import {
  useCreateGame,
  useDistributeRoles,
  useKickPlayer,
  usePlayerNamesToRoles,
} from "../store/useStore";
import TeamDistributionBar from "./TeamDistributionBar";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowDownIcon, ArrowUpIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Role } from "@hidden-identity/server";
import "./Lobby.css";
import { RoleIcon, RoleName, RoleText } from "../shared/RoleIcon";
import rolesIcon from "../assets/icon/mask.svg";
import playersIcon from "../assets/icon/users.svg";
import { DestructiveButton } from "./DestructiveButton";
import { PageLoader } from "../shared/PageLoader";

function StartGameButton({
  onClick,
  isLoading,
  disabled,
  gameStarted,
  className,
}: {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
  gameStarted?: boolean;
  className?: string;
}) {
  if (gameStarted) {
    return <div>Game has started.</div>;
  }
  return (
    <Button disabled={disabled} onClick={onClick} className={className}>
      {isLoading ? "Doing some work..." : "Distribute Roles"}
    </Button>
  );
}

export interface LobbyProps {
  rolesList: Role[];
}

export function Lobby({ rolesList }: LobbyProps) {
  const { game } = useGame();
  const { gameId } = useParams();
  const playersToRoles = usePlayerNamesToRoles();
  const [, kickPlayerLoading, , handleKickPlayer] = useKickPlayer();
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

  const [newGameError, newGameLoading, , newGame] = useCreateGame();

  if (!game) {
    return <PageLoader />;
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
  const assignedRoles = Object.values(game.playersToRoles);

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
      <Tabs.Root
        value={game?.gameStarted ? "players" : selectedTab}
        onValueChange={(e) => setSelectedTab(e as "roles" | "players")}
        className="tab-root"
      >
        <Tabs.List>
          <Tabs.Trigger className="tab-trigger" value="players">
            <img className="tab-icon" src={playersIcon} />
            Players ({Object.keys(game.playersToNames).length})
          </Tabs.Trigger>
          <Tabs.Trigger
            className="tab-trigger"
            disabled={game.gameStarted}
            value="roles"
          >
            <img className="tab-icon" src={rolesIcon} />
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

              <ExportButton disabled={assignedRoles.length === 0} />
              <DestructiveButton
                confirmationText="This will end the current game and create a new one"
                onClick={() => {
                  newGame(gameId);
                }}
              >
                {newGameError && "oops, creating game failed, try again"}
                {newGameLoading ? "Creating new Game" : "New Game"}
              </DestructiveButton>
            </Flex>
            {Object.entries(playersToRoles).length === 0 &&
              "No players have joined yet."}
            {Object.entries(playersToRoles).map(([id, { role, name }]) => (
              <Flex
                justify="between"
                align="center"
                px="3"
                gap="3"
                key={name}
                asChild
              >
                <Text size="2" style={{ textTransform: "capitalize" }}>
                  <RoleText role={role} />
                  <div
                    style={{
                      flex: 2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textTransform: "capitalize",
                    }}
                  >
                    {RoleName(role) ?? "Not yet assigned"}
                  </div>
                  <RoleIcon role={role} style={{ maxHeight: "3em" }} />
                  {!game.gameStarted && (
                    <Button
                      disabled={kickPlayerLoading}
                      size="1"
                      onClick={() => handleKickPlayer(id)}
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

interface ExportButtonProps {
  disabled?: boolean;
  className?: string;
}

function ExportButton({ disabled = false, className }: ExportButtonProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button disabled={disabled} className={className}>Export</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <DialogClose>
          <IconButton variant="ghost">
            <Cross1Icon />
          </IconButton>
        </DialogClose>

        <ExportButtonContent />
      </Dialog.Content>
    </Dialog.Root>
  );
}

function ExportButtonContent() {
  const { game } = useDefiniteGame();
  const [playerOrder, setPlayerOrder] = useState<string[]>(game.orderedPlayers);

  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleMove = (playerId: string, direction: 1 | -1) => {
    setPlayerOrder((oldArr) => {
      const newArr = [...oldArr];
      const index = newArr.findIndex((f) => f === playerId);
      newArr[index] = oldArr[index + direction];
      newArr[index + direction] = oldArr[index];
      return newArr;
    });
  };

  const exportedContent = {
    bluffs: [],
    edition: {},
    roles: "",
    fabled: [],
    players: playerOrder.map((playerId) => ({
      name: game.playersToNames[playerId],
      id: "",
      role: game.playersToRoles[playerId]?.replace("_", ""),
      reminders: [],
      isVoteless: false,
      isDead: false,
      pronouns: "",
    })),
  };

  return (
    <Flex gap="2" direction="column">
      {playerOrder.map((playerId, idx) => {
        return (
          <Flex gap="4" key={playerId}>
            <IconButton
              onClick={() => handleMove(playerId, -1)}
              disabled={idx === 0}
            >
              <ArrowUpIcon />
            </IconButton>
            <IconButton
              onClick={() => handleMove(playerId, 1)}
              disabled={idx === playerOrder.length - 1}
            >
              <ArrowDownIcon />
            </IconButton>
            <div>{game.playersToNames[playerId]}</div>
          </Flex>
        );
      })}

      <Button
        onClick={() => {
          navigator.clipboard.writeText(
            JSON.stringify(exportedContent, null, 4),
          );
          setShowSnackbar(true);
        }}
      >
        Export
      </Button>
      {showSnackbar && <div>Copied to clipboard</div>}
    </Flex>
  );
}
