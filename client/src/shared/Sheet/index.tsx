import { SheetRoot, SheetTrigger, SheetClose } from "./Sheet";
import { GlobalSheetProvider, sheetPortalElement } from "./SheetProvider";
import { useSheetOpen } from "./SheetContext";
import { SheetContent } from "./SheetBody";

export const Sheet = {
  Content: SheetContent,
  Root: SheetRoot,
  Trigger: SheetTrigger,
  Close: SheetClose,
};

export { sheetPortalElement, useSheetOpen, GlobalSheetProvider };
