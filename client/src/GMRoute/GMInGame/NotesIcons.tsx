import { IconButton } from "@radix-ui/themes";
import { LiaVoteYeaSolid } from "react-icons/lia";

import { useDeadVote } from "../../store/actions/gmActions";
import { useDefiniteGame } from "../../store/GameContext";

export function DeadVoteIcon({ player }: { player: string }) {
  const { game } = useDefiniteGame();
  const [, , , clearDeadVote] = useDeadVote();
  const showVote = !(game.deadPlayers[player] && game.deadVotes[player]);
  return (
    <div className="w-4">
      {showVote && (
        <IconButton
          size="1"
          color={game.deadPlayers[player] ? "grass" : "gray"}
          radius="full"
          variant="surface"
          onClick={() => {
            if (game.deadPlayers[player]) {
              void clearDeadVote(player, true);
            }
          }}
        >
          <LiaVoteYeaSolid className="h-2" />
        </IconButton>
      )}
    </div>
  );
}
