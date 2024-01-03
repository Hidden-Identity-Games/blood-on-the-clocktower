import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { type CharacterActionQueueItem, toKeys } from "@hidden-identity/shared";
import { useState } from "react";

import { useDefiniteGame } from "../../../../store/GameContext";
import { useSheetView } from "../../../../store/url";
import { SubmitMessage } from "../../../GMShared/PlayerListComponents/PlayerMessage/messageShared/SubmitMessage";
import { PlayerSelect } from "../../../GMShared/PlayerListComponents/Selectors";

export interface PlayerMessagesTabProps {}

export function PlayerMessagesTab(_props: PlayerMessagesTabProps) {
  const { game } = useDefiniteGame();
  const [_, setSheetView] = useSheetView();

  return (
    <>
      <CustomMessageTab />
      {toKeys(game.messagesByNight).map((night) => (
        <>
          <div className="w-full">Day {night}</div>

          {game.messagesByNight[night].map((message) => (
            <button
              className="w-full"
              onClick={() =>
                setSheetView({
                  type: "message",
                  id: message.id,
                  isOpen: "open",
                })
              }
            >
              <div>{message.player}</div>
              <div>
                {Object.keys(message.messages).map((m) => (
                  <span>
                    {m}: {message.messages[m].length}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </>
      ))}
    </>
  );
}

function CustomMessageTab() {
  const { game } = useDefiniteGame();
  const [forPlayer, setForPlayer] = useState<string>(() => {
    const topOfQueue = game.actionQueue.find(
      (action) => !action.skipped && action.type === "character",
    ) as CharacterActionQueueItem | undefined;
    return topOfQueue ? topOfQueue.player : game.playerList[0];
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="soft" className="w-full">
          Create Message
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>Create new message</Dialog.Header>
        <div className="text-xl font-semibold">Who is the message for?</div>
        <div className="my-3 flex w-full items-center *:w-full">
          <PlayerSelect
            currentPlayer={forPlayer}
            onSelect={(player) => player && setForPlayer(player)}
          />
        </div>

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="ghost">Cancel</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <SubmitMessage player={forPlayer} message={[]} />
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
