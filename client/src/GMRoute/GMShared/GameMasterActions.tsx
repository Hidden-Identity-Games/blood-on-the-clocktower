import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { Select } from "@design-system/components/ui/select";
import { type Role } from "@hidden-identity/shared";
import { Flex, Text } from "@radix-ui/themes";
import { AlertCircleIcon, Share2 } from "lucide-react";

import { NewGameButton } from "../../NewGamePage/NewGameButton";
import { DestructiveButton } from "../../shared/DestructiveButton";
import { QRCodeModal } from "../../shared/QRCodeModal";
import {
  useDistributeRoles,
  useSetGameStatus,
} from "../../store/actions/gmActions";
import { useOrderPlayer } from "../../store/actions/playerActions";
import { useDefiniteGame } from "../../store/GameContext";
import { urlFromOrigin, useSearchParams } from "../../store/url";
import { UndoButton } from "../GMInGame/Tabs/MenuTab/UndoButton";
import { ExportButton } from "./ExportButton";

interface GameMasterActionsProps {
  gameStartable: boolean;
  availableRolesList: Role[];
}

export function GameMasterActions({
  gameStartable,
  availableRolesList,
}: GameMasterActionsProps) {
  const { game } = useDefiniteGame();
  const [searchParams] = useSearchParams();
  const [, , , setGameStatus] = useSetGameStatus();
  const [distributeRolesError, , , distributeRoles, clear] =
    useDistributeRoles();

  const problems =
    game.orderedPlayers.problems && game.orderedPlayers.playerProblems;

  return (
    <Flex gap="2" direction="column">
      <UndoButton />

      <Dialog.Root open={!!distributeRolesError}>
        <Dialog.Content className="m-2">
          <Dialog.Header>Error</Dialog.Header>
          <Flex direction="column" gap="2">
            <div>It looks like there was an error:</div>
            {distributeRolesError}
            <Button onClick={clear}>Retry</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {game.gameStatus === "PlayersJoining" && (
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button disabled={!gameStartable} className="">
              Start Game
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header>Start game?</Dialog.Header>
            <Flex direction="column" gap="2">
              {gameStartable ? (
                <>
                  <Text>
                    Ready to start the game? This cannot be undone, players will
                    recieve roles.
                  </Text>
                  <Flex justify="end">
                    <Dialog.Close asChild>
                      <Button
                        onClick={() => {
                          void distributeRoles(availableRolesList);
                        }}
                      >
                        Start Game
                      </Button>
                    </Dialog.Close>
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
      <NewGameButton>New Game</NewGameButton>
      {game.gameStatus !== "PlayersJoining" &&
        (game.gameStatus === "Setup" ? (
          <ExportButton className="w-full" />
        ) : (
          <DestructiveButton
            onClick={() => void setGameStatus("Setup")}
            confirmationText="All notes and statuses will be kept."
          >
            Back to First Day
          </DestructiveButton>
        ))}

      <QRCodeModal
        message="Scan to open phone view:"
        // TODO: update to use url.ts
        url={urlFromOrigin("gm", searchParams)}
      >
        <Button>
          <Share2 className="h-[1em]" /> Share GM view
        </Button>
      </QRCodeModal>
      <PlayerSeatingModal />
    </Flex>
  );
}

function PlayerSeatingModal() {
  const { game } = useDefiniteGame();
  const [, , , setPlayerOrder] = useOrderPlayer();
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Player seating</Button>
      </Dialog.Trigger>
      <Dialog.Content className="flex flex-col gap-1">
        <Dialog.Header>Player Seating</Dialog.Header>
        {game.orderedPlayers.fullList.map((player) => (
          <div className="columns-2" key={player}>
            <div>
              <span className="capitalize">{player} </span>
              {game.orderedPlayers.playerProblems?.[player] && (
                <AlertCircleIcon className="inline-block" />
              )}
            </div>
            <PlayerSelect
              currentPlayer={
                game.partialPlayerOrdering[player]?.rightNeighbor ?? null
              }
              onSelect={(newNeighbor) => {
                void setPlayerOrder(player, newNeighbor);
              }}
            />
          </div>
        ))}
      </Dialog.Content>
    </Dialog.Root>
  );
}

interface PlayerSelectProps {
  currentPlayer: string | null;
  onSelect: (nextrole: string | null) => void;
}

function PlayerSelect({ currentPlayer, onSelect }: PlayerSelectProps) {
  const { game } = useDefiniteGame();
  const playerList = [...game.playerList].sort();

  return (
    <Select.Root>
      <Select.Trigger className="capitalize">{currentPlayer}</Select.Trigger>
      <Select.OptionsList className="flex flex-col gap-1">
        <Select.Option
          isCurrentlySelected={!currentPlayer}
          className="capitalize"
          onClick={() => onSelect(null)}
        >
          NONE
        </Select.Option>
        {[...playerList].map((player) => (
          <Select.Option
            key={player}
            className="capitalize"
            isCurrentlySelected={player === currentPlayer}
            onClick={() => onSelect(player)}
          >
            {player}
          </Select.Option>
        ))}
      </Select.OptionsList>
    </Select.Root>
  );
}
