import { useGame, useSetScript } from "../store/useStore";
import { useParams } from "react-router-dom";
import { GameProvider } from "../store/GameContextProvider";
import { Lobby } from "./Lobby";
import { ScriptSelect } from "./ScriptSelect";
import { GameHeader } from "../shared/GameHeader";
import { LoadingExperience } from "../shared/LoadingExperience";
import { NightOrder } from "./NightOrder";
import { Theme } from "@radix-ui/themes";
import { CSSProperties } from "react";

export function GameMasterRoot() {
  const { gameId, gmHash } = useParams();
  return (
    <Theme
      appearance="dark"
      accentColor="purple"
      panelBackground="solid"
      hasBackground
      style={
        {
          "--scaling": 1.5,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        } as CSSProperties
      }
    >
      <GameProvider gameId={gameId!}>
        <GamemasterLanding providedGMHash={gmHash!} />
      </GameProvider>
    </Theme>
  );
}

function GamemasterLanding({ providedGMHash }: { providedGMHash: string }) {
  const { game, script } = useGame();
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
        (script?.length ? (
          <Lobby />
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
