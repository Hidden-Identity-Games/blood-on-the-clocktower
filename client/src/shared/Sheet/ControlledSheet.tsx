import { useSheetView } from "../../store/url";
import { PlayerSheet } from "./SheetTypes/PlayerSheet";
import { MessageSheet } from "./SheetTypes/MessageSheet";
import { exhaustiveCheck } from "@hidden-identity/shared";
import { BlankSheet } from "./SheetTypes/BlankSheet";

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
      return <BlankSheet />;
    default:
      exhaustiveCheck(sheetView.type);
  }
}
