import { useDefiniteGame } from "../../../../store/GameContext";
import { PlayerActionSheet } from "./PlayerActionSheet";
import { isSpecialActionType, SpecialActionSheet } from "./SpecialActionSheet";

export interface ActionSheetProps {
  sheetId: string;
}

export function ActionSheet({ sheetId }: ActionSheetProps) {
  const { game } = useDefiniteGame();
  if (isSpecialActionType(sheetId)) {
    return <SpecialActionSheet actionType={sheetId} />;
  }

  const player = sheetId;

  if (!Reflect.has(game.playersToRoles, player)) {
    console.error(`player not found ${player}`);
    return null;
  }

  return <PlayerActionSheet player={player} />;
}
