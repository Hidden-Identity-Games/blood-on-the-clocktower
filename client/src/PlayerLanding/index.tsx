import AddPlayer from "./AddPlayer";
import { PlayerRole } from "./PlayerRole";
import { usePlayer } from "../store/usePlayer";
import { LoadingExperience } from "../shared/LoadingExperience";
import { PlayerChooseNeighbor } from "./PlayerChooseNeighbor";
import { useGame } from "../store/GameContext";
import { Callout } from "@radix-ui/themes";
import { PlayerInGame } from "./PlayerInGame";
import { PlayerRoleSelect } from "./PlayerRoleSelect";

export function PlayerRoot() {
  return <PlayerLanding />;
}

function PlayerLanding() {
  const [player] = usePlayer();
  const { game } = useGame();
  const role = (player && game?.playersToRoles[player]) ?? null;

  if (!game) return <LoadingExperience>Loading...</LoadingExperience>;

  if (!player || !game.playerList.includes(player)) {
    return (
      <>
        {player && !role && (
          <Callout.Root>
            <Callout.Text>
              It looks like you were kicked from the game, consult the
              Storyteller before rejoining.
            </Callout.Text>
          </Callout.Root>
        )}
        <AddPlayer />
      </>
    );
  }

  if (game.travelers[player]) {
    if (game.gameStatus === "PlayersJoining") {
      return <PlayerChooseNeighbor />;
    }

    if (!game.partialPlayerOrdering[player]?.rightNeighbor) {
      return <PlayerChooseNeighbor />;
    }

    if (!game.playersToRoles[player]) {
      return <div>Please see the storyteller for a role.</div>;
    }

    if (!game.playersSeenRoles.includes(player)) {
      return <PlayerRole role={game.playersToRoles[player]} />;
    }
    return <PlayerInGame />;
  } else {
    if (!game.playersSeenRoles.includes(player)) {
      if (!role || role === "unassigned") {
        return <PlayerRoleSelect />;
      }
      return <PlayerRole role={role} />;
    }
    return <PlayerInGame />;
  }
}
