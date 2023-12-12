import { UnifiedGame } from "@hidden-identity/shared";
import { usePlayerOrder } from "./PlayerListOrder";
import { Text } from "@radix-ui/themes";

interface ExecutionInfoProps {
  game: UnifiedGame;
  firstSeat: string | null;
}

const ExecutionInfo = ({ game, firstSeat }: ExecutionInfoProps) => {
  const players = usePlayerOrder("seat order", firstSeat);
  const alivePlayers = players.filter((p) => !game.deadPlayers[p]);
  const playerOnBlock = Object.entries(game.onTheBlock).reduce<{
    player: string | null;
    votes: number;
  }>(
    (max, current) => {
      if (max.votes === current[1] ?? 0) {
        return {
          player: max.player ? null : current[0],
          votes: max.player ? current[1] + 1 : current[1],
        };
      }
      if (max.votes < current[1]) {
        return { player: current[0], votes: current[1] };
      }
      return max;
    },
    { votes: Math.ceil(alivePlayers.length / 2), player: null },
  );

  return (
    <>
      <Text className="capitalize">{`Executing: ${
        playerOnBlock.player ?? "-"
      }`}</Text>
      <Text>
        {`Votes ${playerOnBlock.player ? "to tie" : "to execute"}: ${
          playerOnBlock.votes
        }`}
      </Text>
    </>
  );
};

export default ExecutionInfo;
