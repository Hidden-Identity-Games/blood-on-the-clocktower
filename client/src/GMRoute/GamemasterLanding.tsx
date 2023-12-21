import { Callout } from "@radix-ui/themes";
import { BsFillInfoCircleFill } from "react-icons/bs";

import { GameHeader } from "../shared/GameHeader";
import { LoadingExperience } from "../shared/LoadingExperience";
import { useGame } from "../store/useStore";
import { NightOrder } from "./GMInGame";
import { Lobby } from "./GMSetup/Lobby";

function GamemasterLanding() {
  const { game } = useGame();
  const playersNotSeenRole =
    game?.playerList.filter(
      (player) => !game?.playersSeenRoles.includes(player),
    ) ?? [];

  if (!game) {
    return <LoadingExperience>Loading...</LoadingExperience>;
  }

  return (
    <>
      <GameHeader />
      {game.gameStatus === "PlayersJoining" && <Lobby />}

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
