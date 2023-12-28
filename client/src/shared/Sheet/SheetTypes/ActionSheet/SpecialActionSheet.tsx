import {
  exhaustiveCheck,
  type SpecialActionQueueItem,
} from "@hidden-identity/shared";

import { DemonMessage } from "../../../../GMRoute/GMShared/PlayerListComponents/PlayerMessage/MessageCreators/SpecialActionMessageCreators/DemonMessage";
import { MinionsMessages } from "../../../../GMRoute/GMShared/PlayerListComponents/PlayerMessage/MessageCreators/SpecialActionMessageCreators/MinionsMessage";
import { SheetBody, SheetContent, SheetHeader } from "../../SheetBody";

interface SpecialActionSheetProps {
  action: SpecialActionQueueItem;
}

function Header({ action }: SpecialActionSheetProps) {
  return (
    <div className="flex h-full items-center gap-1 bg-[--color-background] capitalize">
      {action.actionType}
    </div>
  );
}

function Body({ action }: SpecialActionSheetProps) {
  switch (action.actionType) {
    case "DEMON":
      return <DemonMessage action={action} />;
    case "MINIONS":
      return <MinionsMessages action={action} />;
    default:
      exhaustiveCheck(action.actionType);
  }
}

export function SpecialActionSheet({ action }: SpecialActionSheetProps) {
  return (
    <SheetBody>
      <SheetContent>
        <Body action={action} />
      </SheetContent>
      <SheetHeader>
        <Header action={action} />
      </SheetHeader>
    </SheetBody>
  );
}
