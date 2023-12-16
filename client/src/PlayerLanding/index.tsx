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
  const hasRole =
    player &&
    game?.playersToRoles[player] &&
    game?.playersToRoles[player] !== "unassigned";

  if (!game) return <LoadingExperience>Loading...</LoadingExperience>;

  if (!player || !game.playerList.includes(player)) {
    return (
      <>
        {player && !game.playerList.includes(player) && (
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
    game.gameStatus === "PlayersJoining" ||
    !game.partialPlayerOrdering[player]?.rightNeighbor
  ) {
    return <PlayerChooseNeighbor />;
  }
  if (game.travelers[player]) {
    if (!hasRole) {
      return (
        <Callout.Root className="m-auto">
          <Callout.Text>Please see the storyteller for a role!</Callout.Text>
        </Callout.Root>
      );
    }

    if (!game.playersSeenRoles.includes(player)) {
      return <PlayerRole role={game.playersToRoles[player]} />;
    }
    return <PlayerInGame />;
  } else {
    if (!game.playersSeenRoles.includes(player)) {
      if (!hasRole) {
        return <PlayerRoleSelect />;
      }
      return <PlayerRole role={game.playersToRoles[player]} />;
    }
    return <PlayerInGame />;
  }
}
