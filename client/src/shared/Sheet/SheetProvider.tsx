import { useMemo, useReducer } from "react";
import { GlobalSheetContext } from "./SheetContext";

export interface SheetProviderProps {
  children: React.ReactNode;
}

export const sheetPortalElement = document.createElement("div");
sheetPortalElement.setAttribute("class", "empty:hidden");

export function GlobalSheetProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = useReducer(
    (
      state: { sheetExpanded: boolean; activeSheet: string },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      action: { type: string; payload: any },
    ): { sheetExpanded: boolean; activeSheet: string } => {
      switch (action.type) {
        case "toggleSheet":
          return {
            activeSheet: state.activeSheet,
            sheetExpanded: action.payload,
          };

        case "setActiveSheet":
          return {
            activeSheet: action.payload,
            sheetExpanded: true,
          };
      }
      return state;
    },
    { sheetExpanded: false, activeSheet: "" },
  );
  // const [activeSheet, setActiveSheet] = useState("");
  // const [sheetExpanded, setSheetExpanded] = useState(false);
  const contextValue = useMemo(
    () => ({
      sheetExpanded: state.sheetExpanded,
      setSheetExpanded: (isExpanded: boolean) =>
        dispatch({ type: "toggleSheet", payload: isExpanded }),
      activeSheet: state.activeSheet,
      setActiveSheet: (sheet: string) => {
        dispatch({ type: "setActiveSheet", payload: sheet });
        // setActiveSheet(sheet);
        // setSheetExpanded(true);
      },
    }),
    [state],
  );
  return (
    <GlobalSheetContext.Provider value={contextValue}>
      {children}
    </GlobalSheetContext.Provider>
  );
}
