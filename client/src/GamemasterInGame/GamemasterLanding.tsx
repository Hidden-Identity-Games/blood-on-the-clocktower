import { useGame } from "../store/useStore";
import { useParams } from "react-router-dom";
import { GameProvider } from "../store/GameContextProvider";
import { Lobby } from "./Lobby";
import { ScriptSelect } from "./ScriptSelect";
import { Script } from "../types/script";
import { useSearchParams } from "react-router-dom";
import { Role } from "@hidden-identity/server";
import { GameHeader } from "../shared/GameHeader";
import { PageLoader } from "../shared/PageLoader";

export function GameMasterRoot() {
  const { gameId, gmHash } = useParams();
  return (
    <GameProvider gameId={gameId!}>
      <GamemasterLanding providedGMHash={gmHash!} />
    </GameProvider>
  );
}
function useScript() {
  try {
    const [params] = useSearchParams();
    const _script = params.get("script");
    if (_script === null) {
      return null;
    }

    const script = JSON.parse(_script) as Role[];
    return script;
  } catch (e) {
    return null;
  }
}

function GamemasterLanding({ providedGMHash }: { providedGMHash: string }) {
  const script = useScript();
  const [, setSearchParams] = useSearchParams();

  const { game } = useGame();

  if (!game) {
    return <PageLoader />;
  }
  if (providedGMHash !== game.gmSecretHash) {
    return <div>You are in the wrong place</div>;
  }

  return (
    <>
      <GameHeader />
      {script ? (
        <Lobby rolesList={script} />
      ) : (
        <ScriptSelect
          handleSubmit={(script: Script) => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.set("script", JSON.stringify(script.map(({ id }) => id)));
              return next;
            });
          }}
        />
      )}
    </>
  );
}

export { GamemasterLanding };
