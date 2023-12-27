import { useDefiniteGame } from "../../../../store/GameContext";
import { PlayerActionSheet } from "./PlayerActionSheet";
import { SpecialActionSheet } from "./SpecialActionSheet";

export interface ActionSheetProps {
  sheetId: string;
}

export function ActionSheet({ sheetId }: ActionSheetProps) {
  const { game } = useDefiniteGame();
  const action = game.actionQueue.queue.find(({ id }) => id === sheetId);
  if (!action) {
    throw new Error("MEssage not found");
  }

  if (action.type === "game") {
    return <SpecialActionSheet action={action} />;
  }

  return <PlayerActionSheet action={action} />;
}
