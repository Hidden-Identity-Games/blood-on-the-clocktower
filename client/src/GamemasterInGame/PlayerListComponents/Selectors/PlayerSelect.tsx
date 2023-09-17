import { Button, Dialog, Flex, Heading, IconButton } from "@radix-ui/themes";
import { useDefiniteGame } from "../../../store/GameContext";
import { RoleIcon } from "../../../shared/RoleIcon";
import { PlusIcon } from "@radix-ui/react-icons";

interface PlayerSelectProps {
  currentPlayer: string;
  onSelect: (nextrole: string | null) => void;
}

export function PlayerSelect({ currentPlayer, onSelect }: PlayerSelectProps) {
  const { game } = useDefiniteGame();
  const playerList = [...game.playerList].sort();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="outline" size="3" className="capitalize">
          <Flex className="w-full text-center" align="center" justify="center">
            {currentPlayer}
            <RoleIcon role={game.playersToRoles[currentPlayer]} />
          </Flex>
        </Button>
      </Dialog.Trigger>
      <Flex direction="column" gap="1" asChild>
        <Dialog.Content>
          <Dialog.Close key="remove">
            <Button
              className="capitalize"
              size="3"
              variant={currentPlayer === null ? "soft" : "outline"}
              onClick={() => onSelect(null)}
            >
              {"Remove"}
            </Button>
          </Dialog.Close>
          {playerList.map((player) => (
            <Dialog.Close key={player}>
              <Button
                className="capitalize"
                size="3"
                variant={player === currentPlayer ? "soft" : "outline"}
                onClick={() => onSelect(player)}
              >
                <Flex
                  className="w-full text-center"
                  align="center"
                  justify="center"
                >
                  {player}
                  <RoleIcon role={game.playersToRoles[player]} />
                </Flex>
              </Button>
            </Dialog.Close>
          ))}
        </Dialog.Content>
      </Flex>
    </Dialog.Root>
  );
}

interface PlayerSelectListProps {
  addPlayer: () => void;
  replacePlayer: (replaceValue: string | null, index: number) => void;
  players: string[];
}

export function PlayerSelectList({
  players,
  addPlayer,
  replacePlayer,
}: PlayerSelectListProps) {
  return (
    <>
      <Heading className="flex items-center gap-1">
        Player{" "}
        <IconButton
          variant="ghost"
          radius="full"
          className="pt-1"
          onClick={() => {
            addPlayer();
          }}
        >
          <PlusIcon />
        </IconButton>
      </Heading>
      {[...players].map((currentPlayer, index) => (
        <PlayerSelect
          key={currentPlayer}
          currentPlayer={currentPlayer}
          onSelect={(newPlayer) => replacePlayer(newPlayer, index)}
        />
      ))}
    </>
  );
}
