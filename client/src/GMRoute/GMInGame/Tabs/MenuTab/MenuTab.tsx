import { ScriptList } from "../../../../shared/ScriptList";
import { GameMasterActions } from "../../../GMShared/GameMasterActions";
import { UndoButton } from "./UndoButton";

export function MenuTab() {
  return (
    <>
      <UndoButton />
      <GameMasterActions gameStartable={false} availableRolesList={[]} />
      <ScriptList className="my-5" />
    </>
  );
}
