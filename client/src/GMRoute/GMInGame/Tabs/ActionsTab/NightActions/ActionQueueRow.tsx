import { Button } from "@design-system/components/button";
import { type ActionQueueItem } from "@hidden-identity/shared";
import { MoonIcon } from "lucide-react";
import { BsArrowRight } from "react-icons/bs";

import { RoleIcon, RoleText } from "../../../../../shared/RoleIcon";
import { useDefiniteGame } from "../../../../../store/GameContext";
import { useSheetView } from "../../../../../store/url";
import { PlayerName } from "../../../../GMShared/PlayerListComponents/PlayerName";

export interface ActionQueueRowProps {
  queueItem: ActionQueueItem;
}
export function ActionQueueRow({ queueItem }: ActionQueueRowProps) {
  const { game } = useDefiniteGame();
  const disabled = queueItem.skipped;
  const [_, triggerSheet] = useSheetView();

  return (
    <Button
      key={queueItem.id}
      variant="outline"
      disabled={disabled}
      className="h-auto p-3 text-lg"
      onClick={() =>
        triggerSheet({
          isOpen: "open",
          id: queueItem.id,
          type: "action",
        })
      }
    >
      {queueItem.type === "character" ? (
        <>
          <RoleIcon role={queueItem.role} className="mr-2 h-[2em]" />
          <span className="flex-1 text-left">
            <RoleText role={game.playersToRoles[queueItem.player]} />
          </span>
          <span className="mx-2 flex-1 text-right">
            {queueItem.player ? (
              <PlayerName player={queueItem.player} />
            ) : (
              "Skip"
            )}
          </span>

          {!queueItem.skipped && <BsArrowRight />}
        </>
      ) : (
        <>
          <span className="ml-1 mr-3 flex aspect-square h-[1.5em] grow-0 items-center justify-center">
            <MoonIcon />
          </span>
          <span className="flex-1 text-left">{queueItem.actionType}</span>
          {!queueItem.skipped && <BsArrowRight />}
        </>
      )}
    </Button>
  );
}
