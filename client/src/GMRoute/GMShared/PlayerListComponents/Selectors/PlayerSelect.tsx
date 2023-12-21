import { PlusIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, Heading, IconButton } from "@radix-ui/themes";

import { alignmentColorMap } from "../../../../shared/CharacterTypes";
import { PlayerNameWithRoleIcon } from "../../../../shared/RoleIcon";
import { useDefiniteGame } from "../../../../store/GameContext";
import { useGetPlayerAlignment } from "../../../../store/useStore";

interface PlayerSelectProps {
  currentPlayer: string;
  onSelect: (nextrole: string | null) => void;
}

export function PlayerSelect({ currentPlayer, onSelect }: PlayerSelectProps) {
  const { game } = useDefiniteGame();
  const getAlignment = useGetPlayerAlignment();
  const playerList = [...game.playerList].sort();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          variant="outline"
          size="3"
          className="capitalize"
          color={alignmentColorMap[getAlignment(currentPlayer)]}
        >
          <PlayerNameWithRoleIcon player={currentPlayer} />
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
          {[...playerList]
            .sort((a, b) => (getAlignment(a) > getAlignment(b) ? 1 : -1))
            .map((player) => (
              <Dialog.Close key={player}>
                <Button
                  className="capitalize"
                  size="3"
                  color={alignmentColorMap[getAlignment(player)]}
                  variant={player === currentPlayer ? "soft" : "outline"}
                  onClick={() => onSelect(player)}
                >
                  <PlayerNameWithRoleIcon player={player} />
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
