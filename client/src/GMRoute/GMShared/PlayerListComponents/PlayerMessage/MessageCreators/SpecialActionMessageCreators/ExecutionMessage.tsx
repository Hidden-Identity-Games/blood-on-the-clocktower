import { type SpecialActionQueueItem } from "@hidden-identity/shared";

import { usePlayerOnBlock } from "../../../../../../store/useStore";
import { KillAction } from "../../../NightAction/KillAction";

interface ExecutionMessageProps {
  action: SpecialActionQueueItem;
}
export function ExecutionMessage(_props: ExecutionMessageProps) {
  const playerOnBlock = usePlayerOnBlock();

  return (
    <div className="flex w-full flex-col">
      <div>
        The day's executee:{" "}
        <span className="capitalize">{playerOnBlock.player ?? "Nobody"}</span>
      </div>
      <KillAction className="w-full" />
    </div>
  );
}
