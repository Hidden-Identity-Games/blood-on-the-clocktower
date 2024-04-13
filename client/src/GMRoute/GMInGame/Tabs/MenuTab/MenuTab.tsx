import { TimeSince } from "@design-system/components/ui/TimeSince";

import { ScriptList } from "../../../../shared/ScriptList";
import { useDefiniteGame } from "../../../../store/GameContext";
import { GameMasterActions } from "../../../GMShared/GameMasterActions";

export function MenuTab() {
  const { game } = useDefiniteGame();
  return (
    <>
      {game.time.startTime && (
        <div>
          Day duration: <TimeSince startTime={game.time.startTime} />
        </div>
      )}
      <GameMasterActions gameStartable={false} />
      <ScriptList className="my-5" />
    </>
  );
}
