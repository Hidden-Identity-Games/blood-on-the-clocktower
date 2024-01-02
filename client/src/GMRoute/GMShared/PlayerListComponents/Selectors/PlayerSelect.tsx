import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { Plus } from "lucide-react";

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
      <Dialog.Trigger asChild>
        <Button
          variant="select"
          className="capitalize"
          color={alignmentColorMap[getAlignment(currentPlayer)]}
        >
          <PlayerNameWithRoleIcon player={currentPlayer} />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="flex flex-col gap-1">
        <Dialog.Close key="remove" asChild>
          <Button
            className="w-full capitalize"
            variant={currentPlayer === null ? "soft" : "outline"}
            onClick={() => onSelect(null)}
          >
            {"Remove"}
          </Button>
        </Dialog.Close>
        {[...playerList]
          .sort((a, b) => (getAlignment(a) > getAlignment(b) ? 1 : -1))
          .map((player) => (
            <Dialog.Close key={player} asChild>
              <Button
                className="w-full capitalize"
                color={alignmentColorMap[getAlignment(player)]}
                variant={player === currentPlayer ? "soft" : "outline"}
                onClick={() => onSelect(player)}
              >
                <PlayerNameWithRoleIcon player={player} />
              </Button>
            </Dialog.Close>
          ))}
      </Dialog.Content>
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
      <div className="flex items-center gap-1">
        <h2 className="text-xl font-bold">Player{players.length > 1 && "s"}</h2>{" "}
        <Button
          variant="ghost"
          className="aspect-square rounded-full p-0"
          onClick={() => {
            addPlayer();
          }}
        >
          <Plus className="text-green-500" />
        </Button>
      </div>
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
