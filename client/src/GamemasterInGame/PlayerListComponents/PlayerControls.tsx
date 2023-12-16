import {
  Dialog,
  Flex,
  Heading,
  IconButton,
  Text,
  TextField,
} from "@radix-ui/themes";
import { GiRaiseZombie } from "react-icons/gi";
import { useDefiniteGame } from "../../store/GameContext";
import { PiKnifeBold } from "react-icons/pi";
import { LiaVoteYeaSolid } from "react-icons/lia";
import { PlayerList } from ".";
import { useDecideFate } from "../../store/actions/gmPlayerActions";
import { useDeadVote } from "../../store/actions/gmActions";
import { FaSkull } from "react-icons/fa6";
import { PlayerName } from "./PlayerName";
import React from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface SetCountProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  min?: number;
  max?: number;
  autoFocus?: boolean;
}
export function SetCount({
  count,
  setCount,
  min = 0,
  max = 100,
  autoFocus = false,
}: SetCountProps) {
  return (
    <>
      <IconButton
        variant="soft"
        radius="full"
        size="3"
        onClick={() => setCount((curr) => Math.max(curr - 1, min))}
      >
        <AiOutlineMinus />
      </IconButton>
      <TextField.Input
        className="w-6"
        size="3"
        type="number"
        value={count}
        onChange={(e) =>
          setCount(
            Number.parseInt(
              e.currentTarget.value ? e.currentTarget.value : "0",
            ),
          )
        }
        min={min}
        max={max}
        autoFocus={autoFocus}
        onFocus={(e) => e.currentTarget.select()}
      />
      <IconButton
        variant="soft"
        radius="full"
        size="3"
        onClick={() => setCount((curr) => Math.min(curr + 1, max))}
      >
        <AiOutlinePlus />
      </IconButton>
    </>
  );
}

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
  const [votes, setVotes] = React.useState<number>(
    game.onTheBlock[player] ?? 0,
  );

  return (
    <Dialog.Root onOpenChange={() => setVotes(game.onTheBlock[player] ?? 0)}>
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
          {/* KILL OR REVIVE PLAYER*/}
          <PlayerList.MenuItem
            onClick={() => handleDecideFate(player, !game.deadPlayers[player])}
            disabled={decideFateLoading}
            id={`${player}-toggle-dead`}
            label={game.deadPlayers[player] ? "Revive" : "Kill"}
          >
            {game.deadPlayers[player] ? <GiRaiseZombie /> : <PiKnifeBold />}
          </PlayerList.MenuItem>

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

          {/* VOTE TO EXECUTE */}
          {/* <SetCountModal
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
          </SetCountModal>*/}
          <Flex direction="column" gap="3">
            <Text className="text-xl">Set Votes to Execute:</Text>
            <Text size="8">
              <Flex justify="center" align="center" gap="7">
                <SetCount count={votes} setCount={setVotes} autoFocus />
              </Flex>
            </Text>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
