import { Dialog, Flex, IconButton } from "@radix-ui/themes";
import { GiRaiseZombie } from "react-icons/gi";
import {
  useAssignRole,
  useDeadVote,
  useDecideFate,
  usePlayerStatuses,
} from "../../store/useStore";
import { RxHamburgerMenu } from "react-icons/rx";
import { useDefiniteGame } from "../../store/GameContext";
import { PiKnifeBold } from "react-icons/pi";
import { FaMasksTheater, FaVial } from "react-icons/fa6";
import { IoIosBeer } from "react-icons/io";
import { LiaVoteYeaSolid } from "react-icons/lia";
import { PlayerList } from ".";
import { RoleSelect } from "./Selectors";
import { UnifiedGame } from "@hidden-identity/server";

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
          <PlayerList.MenuItem
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
          </PlayerList.MenuItem>
          <PlayerList.MenuItem id={`${player}-set-poison`} label="Poisoned">
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
          </PlayerList.MenuItem>
          <PlayerList.MenuItem id={`${player}-set-drunk`} label="Drunk">
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
          </PlayerList.MenuItem>
          {game.deadVotes[player] && (
            <PlayerList.MenuItem
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
            </PlayerList.MenuItem>
          )}
          <PlayerList.MenuItem id="not_needed" label="Change role">
            <RolechangeMenuItem game={game} player={player} />
          </PlayerList.MenuItem>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function RolechangeMenuItem({
  game,
  player,
  ...props
}: {
  game: UnifiedGame;
  player: string;
}) {
  const [, , , setPlayerRole] = useAssignRole();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton {...props}>
          <FaMasksTheater />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content>
        <RoleSelect
          currentRole={game.playersToRoles[player]}
          onSelect={(next) => next && setPlayerRole(player, next)}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
}
