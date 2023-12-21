import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useDefiniteGame } from "../../../../store/GameContext";
import { PlayerNameWithRoleIcon } from "../../../../shared/RoleIcon";
import { useGetPlayerAlignment } from "../../../../store/useStore";
import { alignmentColorMap } from "../../../../shared/CharacterTypes";

function startListAtIndex<T>(list: T[], _index: number): T[] {
  const index = (_index + list.length) % list.length;
  return [...list.slice(index), ...list.slice(0, index)];
}

export function PlayerOrderActionList({ player }: { player: string }) {
  const { game } = useDefiniteGame();
  const getPlayerAlignment = useGetPlayerAlignment();
  const orderedPlayers = game.orderedPlayers;
  if (orderedPlayers.problems) {
    return null;
  }

  const currentPlayerIndex = orderedPlayers.fullList.findIndex(
    (p) => player === p,
  );

  const playersInOrder = startListAtIndex(
    orderedPlayers.fullList,
    currentPlayerIndex - Math.floor(orderedPlayers.fullList.length / 2),
  );
  return (
    <Flex direction="column" gap="2">
      {playersInOrder.map((p) => (
        <Dialog.Close>
          <Button
            mx={p === player ? "1" : "4"}
            variant={p === player ? "outline" : "soft"}
            color={alignmentColorMap[getPlayerAlignment(p)]}
          >
            <PlayerNameWithRoleIcon player={p} />
          </Button>
        </Dialog.Close>
      ))}
    </Flex>
  );
}
