import { useGame, useSetScript } from "../store/useStore";
import { Lobby } from "./Lobby";
import { ScriptSelect } from "./ScriptSelect";
import { GameHeader } from "../shared/GameHeader";
import { LoadingExperience } from "../shared/LoadingExperience";
import { NightOrder } from "./NightOrder";
import { Callout } from "@radix-ui/themes";
import { BsFillInfoCircleFill } from "react-icons/bs";

function GamemasterLanding() {
  const { game, script } = useGame();
  const [, loadingSetScript, , setScript] = useSetScript();
  const playersNotSeenRole =
    game?.playerList.filter(
      (player) => !game?.playersSeenRoles.includes(player),
    ) ?? [];

  if (!game || loadingSetScript) {
    return <LoadingExperience>Loading...</LoadingExperience>;
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
