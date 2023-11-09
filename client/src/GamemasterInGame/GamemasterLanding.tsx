import { useGame, useSetScript } from "../store/useStore";
import { useParams } from "react-router-dom";
import { GameProvider } from "../store/GameContextProvider";
import { Lobby } from "./Lobby";
import { ScriptSelect } from "./ScriptSelect";
import { GameHeader } from "../shared/GameHeader";
import { LoadingExperience } from "../shared/LoadingExperience";
import { NightOrder } from "./NightOrder";
import { Callout, Theme } from "@radix-ui/themes";
import { CSSProperties } from "react";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { useDesktopOrMobile } from "../store/useDesktopOrMobile";
import { DesktopView } from "../GamemasterDesktop/DesktopView";

export function GameMasterRoot() {
  const { gameId, gmHash } = useParams();
  const [view] = useDesktopOrMobile();

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
        {view === "mobile" ? (
          <GamemasterLanding providedGMHash={gmHash!} />
        ) : (
          <DesktopView isPlayerView={false} />
        )}
      </GameProvider>
    </Theme>
  );
}

function GamemasterLanding({ providedGMHash }: { providedGMHash: string }) {
  const { game, script } = useGame();
  const [, loadingSetScript, , setScript] = useSetScript();
  const playersNotSeenRole =
    game?.playerList.filter(
      (player) => !game?.playersSeenRoles.includes(player),
    ) ?? [];

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
          <ScriptSelect onScriptChange={setScript} />
        ))}
      {game.gameStatus === "Setup" && playersNotSeenRole.length > 0 && (
        <Callout.Root>
          <Callout.Icon>
            <BsFillInfoCircleFill />
          </Callout.Icon>
          <Callout.Text>
            Some players have not yet acknowledged their role:{" "}
            {playersNotSeenRole.join(", ")}
          </Callout.Text>
        </Callout.Root>
      )}
      {(game.gameStatus === "Setup" ||
        game.gameStatus === "Started" ||
        game.gameStatus === "Finished") && <NightOrder />}
    </>
  );
}

export { GamemasterLanding };
