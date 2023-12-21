import { createContext, useCallback, useContext } from "react";
import { ParsedSheetView } from "../../store/url";

export const GlobalSheetContext = createContext<{
  sheetExpanded: boolean;
  setSheetExpanded: (expanded: boolean) => void;
  activeSheet: ParsedSheetView | null;
  setActiveSheet: (active: ParsedSheetView) => void;
}>({
  activeSheet: null,
  setActiveSheet: () => {},
  sheetExpanded: false,
  setSheetExpanded: () => {},
});

export function useTriggerSheet() {
  const { setActiveSheet } = useContext(GlobalSheetContext);
  return useCallback(
    (sheet: ParsedSheetView) => {
      setActiveSheet(sheet);
    },
    [setActiveSheet],
  );
}
