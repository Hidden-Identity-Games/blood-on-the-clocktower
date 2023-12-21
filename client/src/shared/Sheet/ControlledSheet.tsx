import { useSheetView } from "../../store/url";
import { PlayerSheet } from "./SheetTypes/PlayerSheet";
import { MessageSheet } from "./SheetTypes/MessageSheet";

export function ControlledSheet() {
  const [sheetView] = useSheetView();
  if (!sheetView) {
    return null;
  }

  switch (sheetView.type) {
    case "action":
      return <PlayerSheet player={sheetView.id} />;
    case "message":
      return <MessageSheet messageId={sheetView.id} />;
    default:
      throw new Error(`unexpected sheet view ${sheetView.type}`);
  }
}
