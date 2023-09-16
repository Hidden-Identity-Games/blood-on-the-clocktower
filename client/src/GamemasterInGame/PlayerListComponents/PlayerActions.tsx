import { Dialog, Flex, IconButton } from "@radix-ui/themes";
import { GiRaiseZombie } from "react-icons/gi";
import {
  useDeadVote,
  useDecideFate,
  usePlayerStatuses,
} from "../../store/useStore";
import { RxHamburgerMenu } from "react-icons/rx";
import { useDefiniteGame } from "../../store/GameContext";
import { PiKnifeBold } from "react-icons/pi";
import { FaVial } from "react-icons/fa6";
import { IoIosBeer } from "react-icons/io";
import { LiaVoteYeaSolid } from "react-icons/lia";

interface PlayerMenuItemProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

export function PlayerMenuItem({ id, label, children }: PlayerMenuItemProps) {
  return (
    <Flex className="text-xl" gap="3">
      <IconButton id={id} variant="soft" size="4" asChild>
        {children}
      </IconButton>
      <label htmlFor={id} className="flex-1 p-1">
        {label}
      </label>
    </Flex>
  );
}

export function PlayerActions({ player }: { player: string }) {
  const { game } = useDefiniteGame();
  const [, decideFateLoading, , handleDecideFate] = useDecideFate();
  const [, deadVoteLoading, , setDeadVote] = useDeadVote();
  const [, playerStatusesLoading, , setPlayerStatus] = usePlayerStatuses();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton id={`${player}-menu-btn`} variant="ghost">
          <RxHamburgerMenu />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content className="m-2">
        <Flex direction="column" gap="2">
          <PlayerMenuItem
            id={`${player}-toggle-dead`}
            label={game.deadPlayers[player] ? "Revive" : "Kill"}
          >
            <Dialog.Close>
              <IconButton
                onClick={() =>
                  handleDecideFate(player, !game.deadPlayers[player])
                }
                disabled={decideFateLoading}
              >
                {game.deadPlayers[player] ? <GiRaiseZombie /> : <PiKnifeBold />}
              </IconButton>
            </Dialog.Close>
          </PlayerMenuItem>
          <PlayerMenuItem id={`${player}-set-poison`} label="Poisoned">
            <Dialog.Close>
              <IconButton
                onClick={() =>
                  setPlayerStatus(player, "add", {
                    type: "poison",
                    id: `${player}-poisoned`,
                  })
                }
                disabled={playerStatusesLoading}
              >
                <FaVial />
              </IconButton>
            </Dialog.Close>
          </PlayerMenuItem>
          <PlayerMenuItem id={`${player}-set-drunk`} label="Drunk">
            <Dialog.Close>
              <IconButton
                onClick={() =>
                  setPlayerStatus(player, "add", {
                    type: "drunk",
                    id: `${player}-drunk`,
                  })
                }
                disabled={playerStatusesLoading}
              >
                <IoIosBeer />
              </IconButton>
            </Dialog.Close>
          </PlayerMenuItem>
          {game.deadVotes[player] && (
            <PlayerMenuItem
              id={`${player}-return-dead-vote`}
              label="Return Dead Vote"
            >
              <Dialog.Close>
                <IconButton
                  onClick={() => setDeadVote(player, false)}
                  disabled={deadVoteLoading}
                >
                  <LiaVoteYeaSolid />
                </IconButton>
              </Dialog.Close>
            </PlayerMenuItem>
          )}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
