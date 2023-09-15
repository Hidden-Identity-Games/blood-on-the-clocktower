import { useGame, useSetScript } from "../store/useStore";
import { useParams } from "react-router-dom";
import { GameProvider } from "../store/GameContextProvider";
import { Lobby } from "./Lobby";
import { ScriptSelect } from "./ScriptSelect";
import { GameHeader } from "../shared/GameHeader";
import { LoadingExperience } from "../shared/LoadingExperience";
import { NightOrder } from "./NightOrder";

export function GameMasterRoot() {
  const { gameId, gmHash } = useParams();
  return (
    <GameProvider gameId={gameId!}>
      <GamemasterLanding providedGMHash={gmHash!} />
    </GameProvider>
  );
}

function GamemasterLanding({ providedGMHash }: { providedGMHash: string }) {
  const { game } = useGame();
  const [, loadingSetScript, , setScript] = useSetScript();

  if (!game || loadingSetScript) {
    return <LoadingExperience>Loading...</LoadingExperience>;
  }
  if (providedGMHash !== game.gmSecretHash) {
    return <div>You are in the wrong place.</div>;
  }

  return (
    <>
      <GameHeader />
      {game.gameStatus === "PlayersJoining" &&
        (game.script ? (
          <Lobby rolesList={game.script.map(({ id }) => id)} />
        ) : (
          <ScriptSelect handleSubmit={setScript} />
        ))}
      {(game.gameStatus === "Setup" ||
        game.gameStatus === "Started" ||
        game.gameStatus === "Finished") && <NightOrder />}
    </>
  );
}

export { GamemasterLanding };
