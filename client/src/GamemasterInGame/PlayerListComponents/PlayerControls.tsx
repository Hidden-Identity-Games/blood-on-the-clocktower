import { Button, Dialog, Flex, Heading, Text } from "@radix-ui/themes";
import { GiRaiseZombie } from "react-icons/gi";
import { useDefiniteGame } from "../../store/GameContext";
import { PiKnifeBold } from "react-icons/pi";
import { LiaVoteYeaSolid } from "react-icons/lia";
import { PlayerList } from ".";
import { useDecideFate } from "../../store/actions/gmPlayerActions";
import { useDeadVote } from "../../store/actions/gmActions";
import { FaSkull } from "react-icons/fa6";
import React from "react";
import { DialogHeader } from "../../shared/DialogHeader";
import { SetCount } from "../../shared/SetCount";
import classNames from "classnames";

export function PlayerControls({
  player,
  children,
  onSet,
}: {
  player: string;
  children: React.ReactNode;
  onSet: (num: number) => void;
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
        <DialogHeader>
          <Flex className="flex-1 justify-center " align="center" gap="3">
            <FaSkull
              className={game.deadPlayers[player] ? "opacity-100" : "opacity-0"}
            />
            <Heading>
              <Text
                className={classNames(
                  "flex-1 capitalize",
                  game.deadPlayers[player] && "line-through",
                )}
              >
                {player}
              </Text>
            </Heading>
          </Flex>
        </DialogHeader>

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
          <div
            className={game.deadPlayers[player] ? "opacity-100" : "opacity-0"}
          >
            <PlayerList.MenuItem
              id={`${player}-toggle-dead-vote`}
              label={
                game.deadVotes[player] ? "Return Dead Vote" : "Use Dead Vote"
              }
              onClick={() => setDeadVote(player, !game.deadVotes[player])}
              disabled={deadVoteLoading || !game.deadPlayers[player]}
            >
              <LiaVoteYeaSolid />
            </PlayerList.MenuItem>
          </div>
          {/* VOTE TO EXECUTE */}
          <Flex direction="column" gap="4" className="mt-2">
            <Text className="text-center text-xl">Votes to Execute</Text>
            <Text size="8">
              <Flex justify="center" align="center" gap="7">
                <SetCount count={votes} setCount={setVotes} autoFocus />
              </Flex>
            </Text>
            <Dialog.Close>
              <Button size="3" className="mt-1" onClick={() => onSet(votes)}>
                Confirm
              </Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
