import { Button } from "@design-system/components/button";
import { useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";

import { useDefiniteGame } from "../../../../../store/GameContext";
import { ProgressTimeButton } from "../ProgressTimeButton";
import { ActionQueueRow } from "./ActionQueueRow";

interface NightActionsProps {}
export function NightActions(_props: NightActionsProps) {
  const { game } = useDefiniteGame();
  const [showAll, setShowAll] = useState(false);
  const { computedActionQueue } = game;
  const allCompleted = computedActionQueue.every(({ skipped }) => skipped);
  return (
    <>
      <div className="flex">
        <div className="flex-1 text-3xl font-semibold">Action Queue</div>
        <Button variant="secondary" onClick={() => setShowAll(!showAll)}>
          {showAll ? <BiShow /> : <BiHide />}
        </Button>
      </div>
      {computedActionQueue
        .filter((current) => showAll || !current.skipped)
        .map((queueItem) => (
          <ActionQueueRow queueItem={queueItem} key={queueItem.id} />
        ))}
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