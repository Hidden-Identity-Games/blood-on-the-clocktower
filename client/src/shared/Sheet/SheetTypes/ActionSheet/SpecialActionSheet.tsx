import { exhaustiveCheck } from "@hidden-identity/shared";

import { DemonMessage } from "../../../../GMRoute/GMShared/PlayerListComponents/PlayerMessage/MessageCreators/SpecialActionMessageCreators/DemonMessage";
import { MinionsMessages } from "../../../../GMRoute/GMShared/PlayerListComponents/PlayerMessage/MessageCreators/SpecialActionMessageCreators/MinionsMessage";
import { SheetBody, SheetContent, SheetHeader } from "../../SheetBody";

export const SPECIAL_ACTION_IDS = ["DEMON", "MINIONS"] as const;
type SpecialActionType = (typeof SPECIAL_ACTION_IDS)[number];
export function isSpecialActionType(id: string): id is SpecialActionType {
  return SPECIAL_ACTION_IDS.includes(id as SpecialActionType);
}

interface SpecialActionSheetProps {
  actionType: SpecialActionType;
}

function Header({ actionType }: SpecialActionSheetProps) {
  return (
    <div className="flex h-full items-center gap-1 bg-[--color-background] capitalize">
      {actionType}
    </div>
  );
}

function Body({ actionType }: SpecialActionSheetProps) {
  switch (actionType) {
    case "DEMON":
      return <DemonMessage />;
    case "MINIONS":
      return <MinionsMessages />;
    default:
      exhaustiveCheck(actionType);
  }
}

export function SpecialActionSheet({ actionType }: SpecialActionSheetProps) {
  return (
    <SheetBody>
      <SheetContent>
        <Body actionType={actionType} />
      </SheetContent>
      <SheetHeader>
        <Header actionType={actionType} />
      </SheetHeader>
    </SheetBody>
  );
}
