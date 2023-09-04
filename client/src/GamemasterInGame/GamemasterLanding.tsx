import { useState } from "react";
import { useGame } from "../store/useStore";
import { useParams } from "react-router-dom";
import { GameProvider } from "../store/GameContextProvider";
import { Lobby } from "./Lobby";
import { ScriptSelect } from "./ScriptSelect";

export function GameMasterRoot() {
  const { gameId, gmHash } = useParams();
  return (
    <GameProvider gameId={gameId!}>
      <GamemasterLanding providedGMHash={gmHash!} />
    </GameProvider>
  );
}
function GamemasterLanding({ providedGMHash }: { providedGMHash: string }) {
  const [mode, _setMode] = useState<"lobby" | "scriptSelect" | "other">(
    "lobby",
  );

  const { game } = useGame();

  if (!game) {
    return <div>Loading...</div>;
  }
  if (providedGMHash !== game.gmSecretHash) {
    return <div>You are in the wrong place</div>;
  }

  if (mode === "lobby") {
    return <Lobby />;
  }

  if (mode === "scriptSelect") {
    return <ScriptSelect handleSubmit={() => {}} />;
  }

  return <div>uh oh</div>;
}

export default GamemasterLanding;
