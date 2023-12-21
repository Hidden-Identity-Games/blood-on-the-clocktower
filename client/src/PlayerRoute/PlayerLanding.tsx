import { Callout } from "@radix-ui/themes";

import { LoadingExperience } from "../shared/LoadingExperience";
import { useGame } from "../store/GameContext";
import { usePlayer } from "../store/usePlayer";
import { PlayerInGame } from "./PlayerInGame/PlayerInGame";
import AddPlayer from "./PlayerJoining/AddPlayer";
import { PlayerWaiting } from "./PlayerSetup";
import { PlayerRole } from "./PlayerSetup/PlayerRole";
import { PlayerRoleSelect } from "./PlayerSetup/PlayerRoleSelect";

export function PlayerLanding() {
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

  if (
    game.travelers[player] &&
    !game.partialPlayerOrdering[player]?.rightNeighbor
  ) {
    return <PlayerWaiting />;
  }

  if (game.gameStatus === "PlayersJoining") {
    return <PlayerWaiting />;
  }

  if (!game.playersSeenRoles.includes(player)) {
    if (!role || role === "unassigned") {
      return <PlayerRoleSelect />;
    }
    return <PlayerRole role={role} />;
  }

  return <PlayerInGame />;
}
