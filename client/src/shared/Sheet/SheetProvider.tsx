import { useMemo, useState } from "react";
import { GlobalSheetContext } from "./SheetContext";

export interface SheetProviderProps {
  children: React.ReactNode;
}

export const sheetPortalElement = document.createElement("div");
sheetPortalElement.setAttribute("class", "empty:hidden");

export function GlobalSheetProvider({ children }: React.PropsWithChildren) {
  const [activeSheet, setActiveSheet] = useState("");
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const contextValue = useMemo(
    () => ({
      sheetExpanded,
      setSheetExpanded,
      activeSheet,
      setActiveSheet: (sheet: string) => {
        setSheetExpanded(true);
        setActiveSheet(sheet);
      },
    }),
    [activeSheet, sheetExpanded],
  );
  return (
    <GlobalSheetContext.Provider value={contextValue}>
      {children}
    </GlobalSheetContext.Provider>
  );
}
