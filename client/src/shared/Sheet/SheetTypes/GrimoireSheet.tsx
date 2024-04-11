import { Book } from "lucide-react";

import { useIsHiddenView } from "../../../store/url";
import { GMGrimoire } from "../../Grimoire/GrimoireView";
import {
  LockedSheetHeader,
  SheetBody,
  SheetContent,
  SheetHeader,
} from "../SheetBody";

function Header() {
  const [hiddenView] = useIsHiddenView();

  return hiddenView ? (
    <LockedSheetHeader />
  ) : (
    <div className="flex h-full items-center px-2 text-3xl font-bold">
      <Book className="inline-block pr-1" size="1em" />
      <div className="flex-1 pl-2 text-left">Grimoire</div>
    </div>
  );
}
function Body() {
  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <GMGrimoire />
    </div>
  );
}

export interface GrimoireSheetProps {
  GrimoireId: string;
}

export function GrimoireSheet() {
  return (
    <SheetBody>
      <SheetContent>
        <Body />
      </SheetContent>
      <SheetHeader>
        <Header />
      </SheetHeader>
    </SheetBody>
  );
}
