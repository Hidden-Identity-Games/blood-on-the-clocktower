import AddPlayer from "./AddPlayer";
import PlayerRole from "./PlayerRole";
import { GameProvider } from "../store/GameContextProvider";
import { useParams } from "react-router-dom";
import { usePlayer } from "../store/secretKey";
import { GameHeader } from "../shared/GameHeader";
import { LoadingExperience } from "../shared/LoadingExperience";
import { PlayerWaiting } from "./PlayerWaiting";
import { useGame } from "../store/GameContext";
import { useEffect, useState } from "react";
import { Callout } from "@radix-ui/themes";
import { PlayerInGame } from "./PlayerInGame";

export function PlayerRoot() {
  const { gameId } = useParams();
  return (
    <GameProvider gameId={gameId!}>
      <GameHeader />
      <PlayerLanding />
    </GameProvider>
  );
}

function PlayerLanding() {
  const [player, setPlayer] = usePlayer();
  const [kicked, setKicked] = useState(false);
  const { game } = useGame();
  const role = (player && game?.playersToRoles[player]) ?? null;

  useEffect(() => {
    if (!player || !game) {
      // Hasn't joined yet
      return;
    }
    // They have joined, but have been removed from the server
    if (!role) {
      setPlayer(null);
      setKicked(true);
    }
  }, [role, player, setPlayer, game]);

  if (!game) return <LoadingExperience>Loading...</LoadingExperience>;

  if (!player) {
    return (
      <>
        {kicked && (
          <Callout.Root>
            <Callout.Text>
              It looks like you were kicked from the game, consult the gm before
              rejoining.
            </Callout.Text>
          </Callout.Root>
        )}
        <AddPlayer />
      </>
    );
  }

  if (!role || role === "unassigned") {
    return (
      <>
        <PlayerWaiting />
      </>
    );
  }

  if (game.gameStatus === "Setup") {
    return <PlayerRole role={role} />;
  }

  return <PlayerInGame />;
}
