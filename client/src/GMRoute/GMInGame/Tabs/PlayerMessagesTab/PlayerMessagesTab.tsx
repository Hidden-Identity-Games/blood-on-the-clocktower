import { toKeys } from "@hidden-identity/shared";

import { useDefiniteGame } from "../../../../store/GameContext";
import { useSheetView } from "../../../../store/url";

export interface PlayerMessagesTabProps {}

export function PlayerMessagesTab(_props: PlayerMessagesTabProps) {
  const { game } = useDefiniteGame();
  const [_, setSheetView] = useSheetView();

  return (
    <>
      {Object.keys(game.messagesByNight).length === 0 && (
        <div>No messages yet</div>
      )}
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
