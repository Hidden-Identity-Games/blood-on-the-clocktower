import { Dialog } from "@design-system/components/ui/dialog";
import { exhaustiveCheck } from "@hidden-identity/shared";
import { Button, Flex, IconButton } from "@radix-ui/themes";
import { FaArrowsRotate } from "react-icons/fa6";
import { MdSort } from "react-icons/md";

import { useGame } from "../store/GameContext";
import { useFirstSeat } from "../store/url";

const orders = ["alphabetical", "seat order"] as const;
export type PlayerOrder = (typeof orders)[number];

interface PlayerListOrderProps {
  selectedOrder: PlayerOrder;
  setSelectedOrder: (order: PlayerOrder) => void;
  player?: string;
}

export function PlayerListOrder({
  selectedOrder,
  setSelectedOrder,
  player,
}: PlayerListOrderProps) {
  const [_, setFirstSeat] = useFirstSeat();

  return (
    <Flex gap="2">
      <Button
        className="flex-1 capitalize"
        size="1"
        onClick={() => {
          const nextOrder = (orders.indexOf(selectedOrder) + 1) % orders.length;
          setSelectedOrder(orders[nextOrder]);
        }}
      >
        <MdSort />
        {selectedOrder}
      </Button>
      <Dialog.Root>
        <Dialog.Trigger asChild disabled={selectedOrder !== "seat order"}>
          <IconButton size="1">
            <FaArrowsRotate />
          </IconButton>
        </Dialog.Trigger>

        <Dialog.Content className="m-3">
          <Dialog.Header>Choose player at the tp of the circle</Dialog.Header>
          <Dialog.Description>
            <ChoosePlayer player={player} setPlayer={setFirstSeat} />
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}

export function usePlayerOrder(order: PlayerOrder, firstSeat?: string | null) {
  const { game } = useGame();

  if (!game) return [];

  if (order === "alphabetical" || !game.playerList.length) {
    return game.playerList ?? [];
  }

  if (order === "seat order") {
    const player = firstSeat ? firstSeat : game.playerList[0];
    return wrapArrayAround(game.orderedPlayers.fullList, player);
  }

  exhaustiveCheck(order);
  return [];
}

interface ChoosePlayerProps {
  setPlayer: (player: string) => void;
  player?: string;
}
function ChoosePlayer({ player, setPlayer }: ChoosePlayerProps) {
  const orderedPlayers = usePlayerOrder("seat order", player);

  return (
    <Flex direction="column" gap="3">
      {orderedPlayers.map((player) => (
        <Dialog.Close asChild key={player}>
          <Button
            className="capitalize"
            variant="soft"
            size="4"
            onClick={() => setPlayer(player)}
          >
            {player}
          </Button>
        </Dialog.Close>
      ))}
    </Flex>
  );
}

function wrapArrayAround<T>(array: T[], wrapAtElement: T) {
  const wrapAtIndex = array.indexOf(wrapAtElement);
  if (wrapAtIndex === -1) throw Error("Element not found in array.");
  return [...array.slice(wrapAtIndex), ...array.slice(0, wrapAtIndex)];
}
