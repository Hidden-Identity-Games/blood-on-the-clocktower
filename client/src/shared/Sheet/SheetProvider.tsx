import { useMemo, useState } from "react";
import { GlobalSheetContext } from "./SheetContext";
import { ParsedSheetView, useSheetView } from "../../store/url";

export interface SheetProviderProps {
  children: React.ReactNode;
}

export function GlobalSheetProvider({ children }: React.PropsWithChildren) {
  const [activeSheet, setActiveSheet] = useSheetView();
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const contextValue = useMemo(
    () => ({
      sheetExpanded,
      setSheetExpanded,
      activeSheet,
      setActiveSheet: (sheet: ParsedSheetView) => {
        setSheetExpanded(true);
        setActiveSheet(sheet);
      },
    }),
    [activeSheet, setActiveSheet, sheetExpanded],
  );
  return (
    <GlobalSheetContext.Provider value={contextValue}>
      {children}
    </GlobalSheetContext.Provider>
  );
}
