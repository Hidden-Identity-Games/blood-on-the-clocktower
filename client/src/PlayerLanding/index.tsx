import AddPlayer from "./AddPlayer";
import { PlayerRole } from "./PlayerRole";
import { usePlayer } from "../store/usePlayer";
import { LoadingExperience } from "../shared/LoadingExperience";
import { PlayerWaiting } from "./PlayerWaiting";
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

  if (game.gameStatus === "Started" && role === "unassigned") {
    return (
      <>
        <Callout.Root>
          <Callout.Text>
            It looks like you're joining as a Traveller. Please see the
            Storyteller for a role.
          </Callout.Text>
        </Callout.Root>
      </>
    );
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
