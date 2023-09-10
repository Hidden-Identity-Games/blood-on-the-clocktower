import AddPlayer from "./AddPlayer";
import PlayerRole from "./PlayerRole";
import { GameProvider } from "../store/GameContextProvider";
import { useParams } from "react-router-dom";
import { usePlayer } from "../store/secretKey";
import { GameHeader } from "../shared/GameHeader";
import { PageLoader } from "../shared/PageLoader";
import { PlayerWaiting } from "./PlayerWaiting";
import { useGame } from "../store/GameContext";
export function GameMasterRoot() {}
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
  const [player] = usePlayer();
  const { game } = useGame();

  if (!game) return <PageLoader />;

  console.log(player);
  if (!player) return <AddPlayer />;

  const role = game?.playersToRoles[player] ?? null;

  if (!role || role === "unassigned")
    return (
      <>
        <PlayerWaiting />
      </>
    );

  return <PlayerRole role={role} />;
}
