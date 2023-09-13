import {
  Button,
  Callout,
  Dialog,
  DialogClose,
  Flex,
  IconButton,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { ArrowLeftIcon, ClipboardCopyIcon } from "@radix-ui/react-icons";
import { useDefiniteGame } from "../store/GameContext";
import { useCreateGame, useDistributeRoles } from "../store/useStore";
import { Role, UnifiedGame, WellOrderedPlayers } from "@hidden-identity/server";
import { useState } from "react";
import { ProblemsPanel } from "./ProblemsPanel";
import classNames from "classnames";
import { DialogHeader } from "../shared/DialogHeader";
import { PlayerNameButton } from "../shared/PlayerNameButton";

interface GameMasterActionsProps {
  selectedRoles: Record<Role, boolean>;
}

export function GameMasterActions({ selectedRoles }: GameMasterActionsProps) {
  const { game } = useDefiniteGame();
  const [distributeRolesError, , , distributeRoles, clear] =
    useDistributeRoles();

  const availableRolesList = Object.keys(selectedRoles).filter(
    (key) => !!selectedRoles[key as Role],
  );

  const problems =
    game.orderedPlayers.problems && game.orderedPlayers.playerProblems;
  const gameStartable =
    !game.orderedPlayers.problems &&
    availableRolesList.length === game.orderedPlayers.fullList.length;

  return (
    <Flex gap="2" direction="row">
      <Dialog.Root open={!!distributeRolesError}>
        <Dialog.Content className="m-2">
          <DialogHeader>Error</DialogHeader>
          <Flex direction="column" gap="2">
            <div>It looks like there was an error:</div>
            {distributeRolesError}
            <Button onClick={clear}>Retry</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
      {game.gameStarted ? (
        <ExportButton className="flex-1" />
      ) : (
        <Dialog.Root>
          <Dialog.Trigger>
            <Button
              color={gameStartable ? undefined : "gray"}
              className="flex-1"
            >
              Start Game
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <DialogHeader>Start game?</DialogHeader>
            <Flex direction="column" gap="2">
              {gameStartable ? (
                <>
                  <Text>
                    Ready to start the game? This cannot be undone, players will
                    recieve roles.
                  </Text>
                  <Flex justify="end">
                    <DialogClose>
                      <Button
                        onClick={() => {
                          distributeRoles(availableRolesList);
                        }}
                      >
                        Start Game
                      </Button>
                    </DialogClose>
                  </Flex>
                </>
              ) : (
                <>
                  {problems ? (
                    <>
                      <Text>Some players have not finished joining</Text>
                      <Text as="div" className="capitalize">
                        {Object.keys(problems).join(", ")}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text>
                        You need to have the same number of roles selected as
                        players.
                      </Text>
                      <Text as="div" className="capitalize">
                        {Object.keys(problems).join(", ")}
                      </Text>
                    </>
                  )}
                </>
              )}
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
      <NewGameButton />
    </Flex>
  );
}

function NewGameButton() {
  const { gameId } = useDefiniteGame();
  const [newGameError, newGameLoading, , newGame] = useCreateGame();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button className="flex-1">New game</Button>
      </Dialog.Trigger>
      <Dialog.Content className="m-2">
        <Flex direction="column" gap="2">
          <Flex className="w-full" justify="end">
            <DialogHeader>Create a new game?</DialogHeader>
          </Flex>
          {newGameLoading && "Setting up, one moment..."}
          {!newGameLoading && (
            <>
              {newGameError && (
                <Callout.Root>
                  <Callout.Text>
                    It looks there was an error, please try again.
                  </Callout.Text>
                </Callout.Root>
              )}
              <Text as="div" className="mb-2">
                Are you sure? The current game will end, and everyone will be
                given a link to join the new game.
              </Text>
              <Flex className="w-full" justify="between">
                <Dialog.Close>
                  <Button>Cancel</Button>
                </Dialog.Close>
                <Button onClick={() => newGame(gameId)}>New game</Button>
              </Flex>
            </>
          )}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

interface ExportButtonProps {
  disabled?: boolean;
  className?: string;
}

function ExportButton({ disabled = false, className }: ExportButtonProps) {
  const { game } = useDefiniteGame();
  console.log(game);
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button disabled={disabled} className={className}>
          Export
        </Button>
      </Dialog.Trigger>

      <Dialog.Content className="m-2">
        <DialogHeader>Export to town square</DialogHeader>
        {game.orderedPlayers.problems ? (
          <ProblemsPanel />
        ) : (
          <ExportButtonContent />
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}

function createContent(players: string[], game: UnifiedGame) {
  return JSON.stringify(
    {
      bluffs: [],
      edition: {},
      roles: "",
      fabled: [],
      players: players.map((player) => ({
        name: player,
        id: "",
        role: game.playersToRoles[player]?.replace("_", ""),
        reminders: [],
        isVoteless: false,
        isDead: false,
        pronouns: "",
      })),
    },
    null,
    4,
  );
}
function ExportButtonContent() {
  const { game } = useDefiniteGame();
  const players = (game.orderedPlayers as WellOrderedPlayers).fullList;
  const [circleTopPlayer, _setCircleTopPlayer] = useState<string | null>(null);
  const [content, setContent] = useState(createContent(players, game));
  const setCircleTopPlayer = (player: string | null) => {
    _setCircleTopPlayer(player);
    const reversedPlayers = [...players].reverse();
    const playerIndex =
      player && reversedPlayers.includes(player)
        ? reversedPlayers.indexOf(player)
        : 0;

    const playersInOrder = [
      ...reversedPlayers.slice(playerIndex),
      ...reversedPlayers.slice(0, playerIndex),
    ];
    setContent(createContent(playersInOrder, game));
  };

  const [showSnackbar, setShowSnackbar] = useState(false);
  if (!circleTopPlayer) {
    return (
      <Flex gap="2" direction="column" className="overflow-y-auto">
        <Text>Please select the player you want at the top of the circle.</Text>
        {players.map((player) => (
          <PlayerNameButton
            key="player"
            onClick={() => setCircleTopPlayer(player)}
          >
            {player}
          </PlayerNameButton>
        ))}
      </Flex>
    );
  }

  return (
    <Flex gap="2" direction="column">
      <TextArea
        className="h-[400px]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></TextArea>

      {
        <div className={classNames(showSnackbar ? "opacity-100" : "opacity-0")}>
          Copied to clipboard
        </div>
      }
      <Flex justify="between">
        <IconButton
          variant="ghost"
          radius="full"
          onClick={() => setCircleTopPlayer(null)}
        >
          <ArrowLeftIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            navigator.clipboard.writeText(content);
            setShowSnackbar(true);
          }}
        >
          <ClipboardCopyIcon />
        </IconButton>
      </Flex>
    </Flex>
  );
}
