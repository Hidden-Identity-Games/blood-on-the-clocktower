import { Button, Dialog, DialogClose, Flex, Text } from "@radix-ui/themes";
import { useDefiniteGame } from "../store/GameContext";
import { DialogHeader } from "../shared/DialogHeader";
import { ExportButton } from "./ExportButton";
import {
  useDistributeRoles,
  useSetGameStatus,
} from "../store/actions/gmActions";
import { DestructiveButton } from "./DestructiveButton";
import { Role } from "@hidden-identity/shared";
import { NewGameButton } from "../NewGamePage/NewGameButton";

interface GameMasterActionsProps {
  gameStartable: boolean;
  availableRolesList: Role[];
}

export function GameMasterActions({
  gameStartable,
  availableRolesList,
}: GameMasterActionsProps) {
  const { game } = useDefiniteGame();
  const [, , , setGameStatus] = useSetGameStatus();
  const [distributeRolesError, , , distributeRoles, clear] =
    useDistributeRoles();
  const problems =
    game.orderedPlayers.problems && game.orderedPlayers.playerProblems;

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
            <Button disabled={!gameStartable} className="">
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
      <NewGameButton>Create new game</NewGameButton>
      {game.gameStatus === "PlayersJoining" && <SandboxOptions />}
    </Flex>
  );
}

function SandboxOptions() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Sandbox tools</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <DialogHeader>Sandbox tools</DialogHeader>
        Coming Soon
      </Dialog.Content>
    </Dialog.Root>
  );
}
