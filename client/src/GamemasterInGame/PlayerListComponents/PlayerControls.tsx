import { Dialog, Flex, Heading } from "@radix-ui/themes";
import { GiAxeInStump, GiRaiseZombie } from "react-icons/gi";
import { useDefiniteGame } from "../../store/GameContext";
import { PiKnifeBold } from "react-icons/pi";
import { LiaVoteYeaSolid } from "react-icons/lia";
import { PlayerList } from ".";
import {
  useDecideFate,
  useVotesToExecute,
} from "../../store/actions/gmPlayerActions";
import { useDeadVote } from "../../store/actions/gmActions";
import { FaSkull } from "react-icons/fa6";
import { PlayerName } from "./PlayerName";
import { SetCountModal } from "../../shared/SetCount";

export function PlayerControls({
  player,
  children,
}: {
  player: string;
  children: React.ReactNode;
}) {
  const { game } = useDefiniteGame();
  const [, decideFateLoading, , handleDecideFate] = useDecideFate();
  const [, deadVoteLoading, , setDeadVote] = useDeadVote();
  const [, , , setVotesToExecute] = useVotesToExecute();

  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content className="m-2">
        <Flex gap="2" direction="column" className="py-2 capitalize">
          <Flex className="justify-center pb-2" align="center">
            {game.deadPlayers[player] && <FaSkull />}
            <Heading className="mx-3">
              <PlayerName player={player} />
            </Heading>
          </Flex>
        </Flex>

        <Flex direction="column" gap="2">
          {/* VOTE TO EXECUTE */}
          <SetCountModal
            title="Set Votes to Execute:"
            onSet={(votes: number) => setVotesToExecute(player, votes)}
            defaultValue={game.onTheBlock[player] ?? 0}
          >
            <PlayerList.MenuItem
              id={`${player}-vote-execute`}
              label="Set Votes to Execute"
            >
              <GiAxeInStump />
            </PlayerList.MenuItem>
          </SetCountModal>

          {/* TOGGLE DEAD VOTE */}
          <PlayerList.MenuItem
            id={`${player}-toggle-dead-vote`}
            label={
              game.deadVotes[player] ? "Return Dead Vote" : "Use Dead Vote"
            }
            onClick={() => setDeadVote(player, !game.deadVotes[player])}
            disabled={deadVoteLoading}
          >
            <LiaVoteYeaSolid />
          </PlayerList.MenuItem>

          {/* KILL OR REVIVE PLAYER*/}
          <PlayerList.MenuItem
            onClick={() => handleDecideFate(player, !game.deadPlayers[player])}
            disabled={decideFateLoading}
            id={`${player}-toggle-dead`}
            label={game.deadPlayers[player] ? "Revive" : "Kill"}
          >
            {game.deadPlayers[player] ? <GiRaiseZombie /> : <PiKnifeBold />}
          </PlayerList.MenuItem>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
