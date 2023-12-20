import {
  Sheet as BaseSheet,
  SheetRoot,
  SheetTrigger,
  SheetClose,
} from "./Sheet";
import { GlobalSheetProvider, sheetPortalElement } from "./SheetProvider";
import { useSheetOpen } from "./SheetContext";

export const Sheet = {
  Content: BaseSheet,
  Root: SheetRoot,
  Trigger: SheetTrigger,
  Close: SheetClose,
};

export { sheetPortalElement, useSheetOpen, GlobalSheetProvider };
