import { useIsHiddenView } from "../../../store/url";
import { LockedSheetHeader, SheetBody, SheetHeader } from "../SheetBody";

export function BlankSheet() {
  const [isHiddenView] = useIsHiddenView();
  return isHiddenView ? (
    <SheetBody>
      <div className="pointer-events-auto w-full flex-1 overflow-y-scroll bg-[--color-background] px-2"></div>
      <SheetHeader>
        <LockedSheetHeader />
      </SheetHeader>
    </SheetBody>
  ) : null;
}
