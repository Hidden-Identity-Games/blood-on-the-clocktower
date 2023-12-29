import { ScriptList } from "../../../../shared/ScriptList";
import { GameMasterActions } from "../../../GMShared/GameMasterActions";

export function MenuTab() {
  return (
    <>
      <GameMasterActions gameStartable={false} availableRolesList={[]} />
      <ScriptList className="my-5" />
    </>
  );
}
