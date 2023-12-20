import { createContext, useContext } from "react";

export const SheetContext = createContext("unset_id");

export const GlobalSheetContext = createContext<{
  sheetExpanded: boolean;
  setSheetExpanded: (expanded: boolean) => void;
  activeSheet: string;
  setActiveSheet: (active: string) => void;
}>({
  activeSheet: "",
  setActiveSheet: () => {},
  sheetExpanded: false,
  setSheetExpanded: () => {},
});

export function useSheetOpen() {
  const sheetId = useContext(SheetContext);
  const { activeSheet } = useContext(GlobalSheetContext);
  return sheetId === activeSheet;
}
