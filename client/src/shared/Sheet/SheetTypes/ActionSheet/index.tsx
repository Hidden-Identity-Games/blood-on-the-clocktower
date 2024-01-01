import { useDefiniteGame } from "../../../../store/GameContext";
import { PlayerActionSheet } from "./PlayerActionSheet";
import { SpecialActionSheet } from "./SpecialActionSheet";

export interface ActionSheetProps {
  sheetId: string;
}

export function ActionSheet({ sheetId }: ActionSheetProps) {
  const { game } = useDefiniteGame();
  const action = game.actionQueue.find(({ id }) => id === sheetId);
  if (!action) {
    return null;
  }

  if (action.type === "game") {
    return <SpecialActionSheet action={action} />;
  }

  return <PlayerActionSheet action={action} />;
}
