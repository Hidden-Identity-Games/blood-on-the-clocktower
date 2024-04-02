import { useSheetView } from "../../store/url";
import { MessageSheet } from "./SheetTypes/MessageSheet";

export function ControlledSheet() {
  const [sheetView] = useSheetView();

  return <MessageSheet messageId={sheetView.id} />;
}
