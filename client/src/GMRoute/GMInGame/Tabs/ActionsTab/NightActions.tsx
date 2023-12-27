import { MoonIcon } from "@radix-ui/react-icons";
import { Button, Heading, IconButton } from "@radix-ui/themes";
import { useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";

import { RoleIcon } from "../../../../shared/RoleIcon";
import { useDefiniteGame } from "../../../../store/GameContext";
import { useSheetView } from "../../../../store/url";
import { PlayerName } from "../../../GMShared/PlayerListComponents/PlayerName";
import { ProgressTimeButton } from "./ProgressTimeButton";

interface NightActionsProps {}
export function NightActions(_props: NightActionsProps) {
  const { game } = useDefiniteGame();
  const [showAll, setShowAll] = useState(false);
  const [_, triggerSheet] = useSheetView();
  const { computedActionQueue } = game;
  const allCompleted = computedActionQueue.every(({ skipped }) => skipped);
  return (
    <>
      <div className="flex">
        <Heading className="flex-1">Action Queue</Heading>
        <IconButton variant="surface" onClick={() => setShowAll(!showAll)}>
          {showAll ? <BiShow /> : <BiHide />}
        </IconButton>
      </div>
      {computedActionQueue
        .filter((current) => showAll || !current.skipped)
        .map((queueItem) => {
          return (
            <Button
              key={queueItem.id}
              variant="ghost"
              className="flex w-full justify-around gap-1"
              disabled={queueItem.skipped}
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
                  <RoleIcon role={queueItem.role} />
                  {queueItem.player ? (
                    <PlayerName player={queueItem.player} />
                  ) : (
                    "Skip"
                  )}
                  {!queueItem.skipped && <BsArrowRight />}
                </>
              ) : (
                <>
                  <span className="flex aspect-square h-[1.5em] grow-0 items-center justify-center">
                    <MoonIcon />
                  </span>
                  <span className="flex-1">{queueItem.actionType}</span>
                  {<BsArrowRight />}
                </>
              )}
            </Button>
          );
        })}
      <ProgressTimeButton
        confirmationText={
          allCompleted
            ? "All actions marked complete, end the night?"
            : "There are still actions not yet marked completed.  Are you sure you want to end the night?"
        }
      >
        End night
      </ProgressTimeButton>
    </>
  );
}
