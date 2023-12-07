import { Dialog, Flex } from "@radix-ui/themes";
import { useOrderPlayer } from "../store/actions/playerActions";
import { PlayerList } from "../GamemasterInGame/PlayerListComponents";
import { FaArrowsRotate } from "react-icons/fa6";
import { PlayerSelect } from "../GamemasterInGame/PlayerListComponents/Selectors";

interface MovePlayerModalProps {
  player: string;
}
export function MovePlayerModal({ player }: MovePlayerModalProps) {
  const [, , , handleOrderPlayer] = useOrderPlayer();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <PlayerList.MenuItem id="move-player" label="Move Player">
          <FaArrowsRotate />
        </PlayerList.MenuItem>
      </Dialog.Trigger>

      <Dialog.Content className="m-2">
        <Flex direction="column" justify="center" align="center">
          <Flex gap="3" align="center" asChild>
            <label>
              {`Select player to ${player}'s right:`}
              <PlayerSelect
                currentPlayer={player}
                onSelect={(neighbor) => handleOrderPlayer(player, neighbor)}
              />
            </label>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
