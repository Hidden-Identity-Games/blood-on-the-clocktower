import { Button } from "@design-system/components/button";
import { Dialog, DialogClose } from "@design-system/components/ui/dialog";
import {
  type Alignment,
  type CharacterActionQueueItem,
  exhaustiveCheck,
  generateThreeWordId,
  type Role,
} from "@hidden-identity/shared";
import { useReducer } from "react";

import { useDefiniteGame } from "../../../../store/GameContext";
import { ALIGNMENTS } from "../../../../types/script";
import { SubmitMessage } from "../PlayerMessage/messageShared/SubmitMessage";

interface PlayerRoleAlignmentStateItem {
  player: string | null;
  role: Role | null;
  alignment: Alignment | null;
  itemId: string;
}
type PlayerRoleAlignmentAction =
  | {
      type: "add";
    }
  | { type: "remove"; itemId: string }
  | {
      type: "update";
      itemId: string;
      item: Partial<PlayerRoleAlignmentStateItem>;
    };

export interface PlayerRoleAlignmentSelectorProps {
  action: CharacterActionQueueItem;
}
export function PlayerRoleAlignmentSelector({
  action,
}: PlayerRoleAlignmentSelectorProps) {
  const [messageRows, dispatch] = useReducer(
    (
      state: PlayerRoleAlignmentStateItem[],
      action: PlayerRoleAlignmentAction,
    ) => {
      switch (action.type) {
        case "add":
          return [
            ...state,
            {
              player: null,
              role: null,
              alignment: null,
              itemId: generateThreeWordId(),
            } satisfies PlayerRoleAlignmentStateItem,
          ];
        case "remove":
          return state.filter((item) => item.itemId !== action.itemId);
        case "update":
          return state.map((item) =>
            item.itemId === action.itemId ? { ...item, ...action.item } : item,
          );
        default:
          exhaustiveCheck(action);
          return state;
      }
    },
    [] as PlayerRoleAlignmentStateItem[],
  );
  return (
    <>
      {messageRows.map((message) => (
        <Row message={message} key={message.itemId} onChange={dispatch} />
      ))}
      <Button onClick={() => dispatch({ type: "add" })}>Add message row</Button>
      <SubmitMessage
        action={action}
        player={action.player}
        message={messageRows.map((messageRow) => ({
          player: messageRow.player ?? undefined,
          alignment: messageRow.alignment ?? undefined,
          role: messageRow.role ?? undefined,
          group: "Role reveal",
        }))}
      />
    </>
  );
}

interface RowProps {
  message: PlayerRoleAlignmentStateItem;
  onChange: (action: PlayerRoleAlignmentAction) => void;
}
function Row({ message, onChange }: RowProps) {
  const { player, alignment, role, itemId } = message;
  const { game, script } = useDefiniteGame();
  return (
    <div className="flex justify-between gap-1">
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="select" className="max-w-[40%]">
            {player || "No Player"}
          </Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>Player</Dialog.Header>
          <div className="flex w-full flex-1 flex-col gap-2 overflow-y-auto">
            {game.playerList.map((currentPlayer) => (
              <DialogClose asChild>
                <Button
                  onClick={() =>
                    onChange({
                      type: "update",
                      item: { player: currentPlayer },
                      itemId,
                    })
                  }
                >
                  {currentPlayer}
                </Button>
              </DialogClose>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Root>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="select" className="max-w-[35%]  px-1">
            <span className="overflow-hidden text-clip whitespace-nowrap">
              {role || "No Role"}
            </span>
          </Button>
        </Dialog.Trigger>
        <Dialog.Content>
          {script.map(({ id: currentRole }) => (
            <DialogClose asChild>
              <Button
                onClick={() =>
                  onChange({
                    type: "update",
                    item: { role: currentRole },
                    itemId,
                  })
                }
              >
                {currentRole}
              </Button>
            </DialogClose>
          ))}
        </Dialog.Content>
      </Dialog.Root>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="select" className="truncate px-1">
            {alignment || "No alignment"}
          </Button>
        </Dialog.Trigger>
        <Dialog.Content>
          {ALIGNMENTS.map((currentAlignment) => (
            <DialogClose asChild>
              <Button
                onClick={() =>
                  onChange({
                    type: "update",
                    item: { alignment: currentAlignment },
                    itemId,
                  })
                }
              >
                {currentAlignment}
              </Button>
            </DialogClose>
          ))}
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
