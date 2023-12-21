import { useSheetView } from "../../store/url";
import { PlayerSheet } from "./SheetTypes/PlayerSheet";
import { MessageSheet } from "./SheetTypes/MessageSheet";
import { exhaustiveCheck } from "@hidden-identity/shared";

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
    case "none":
      return null;
    default:
      exhaustiveCheck(sheetView.type);
  }
}
