import {
  Button,
  Callout,
  Dialog,
  DialogClose,
  Flex,
  Text,
} from "@radix-ui/themes";
import { useDefiniteGame } from "../store/GameContext";
import { Role } from "@hidden-identity/server";
import { DialogHeader } from "../shared/DialogHeader";
import { ExportButton } from "./ExportButton";
import {
  useDistributeRoles,
  useSetGameStatus,
} from "../store/actions/gmActions";
import { useCreateGame } from "../store/useStore";
import { DestructiveButton } from "./DestructiveButton";

interface GameMasterActionsProps {
  selectedRoles: Record<Role, number>;
}

export function GameMasterActions({ selectedRoles }: GameMasterActionsProps) {
  const { game } = useDefiniteGame();
  const [, , , setGameStatus] = useSetGameStatus();
  const [distributeRolesError, , , distributeRoles, clear] =
    useDistributeRoles();

  const availableRolesList = Object.entries(selectedRoles).flatMap(
    ([role, qty]) => Array.from({ length: qty }).map(() => role),
  ) as Role[];

  const problems =
    game.orderedPlayers.problems && game.orderedPlayers.playerProblems;
  const gameStartable =
    !game.orderedPlayers.problems &&
    availableRolesList.length === game.orderedPlayers.fullList.length;

  return (
    <Flex gap="2" direction="column">
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

      {game.gameStatus === "PlayersJoining" && (
        <Dialog.Root>
          <Dialog.Trigger>
            <Button color={gameStartable ? undefined : "gray"} className="">
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
      {game.gameStatus !== "PlayersJoining" &&
        (game.gameStatus === "Setup" ? (
          <ExportButton />
        ) : (
          <DestructiveButton
            onClick={() => setGameStatus("Setup")}
            confirmationText="All notes and statuses will be kept."
          >
            Back to First Day
          </DestructiveButton>
        ))}
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
        <Button className="">New game</Button>
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
