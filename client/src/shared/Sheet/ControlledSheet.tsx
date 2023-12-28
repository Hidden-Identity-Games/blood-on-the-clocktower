import { exhaustiveCheck } from "@hidden-identity/shared";

import { useSheetView } from "../../store/url";
import { ActionSheet } from "./SheetTypes/ActionSheet";
import { BlankSheet } from "./SheetTypes/BlankSheet";
import { MessageSheet } from "./SheetTypes/MessageSheet";

export function ControlledSheet() {
  const [sheetView] = useSheetView();
  if (!sheetView) {
    return null;
  }

  switch (sheetView.type) {
    case "action":
      return <ActionSheet sheetId={sheetView.id} />;
    case "message":
      return <MessageSheet messageId={sheetView.id} />;
    case "none":
      return <BlankSheet />;
    default:
      exhaustiveCheck(sheetView.type);
  }
}
