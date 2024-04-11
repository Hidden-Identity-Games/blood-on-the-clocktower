import { useSheetView } from "../../store/url";
import { BlankSheet } from "./SheetTypes/BlankSheet";
import { MessageSheet } from "./SheetTypes/MessageSheet";

export function ControlledSheet() {
  const [sheetView] = useSheetView();
  const [isHiddenView] = useSheetView();

  return (
    <>
      {!sheetView.id && isHiddenView && <BlankSheet />}
      <MessageSheet messageId={sheetView.id} />
    </>
  );
}
