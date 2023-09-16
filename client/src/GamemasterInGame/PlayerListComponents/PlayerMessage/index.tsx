import { PlayerMessage } from "@hidden-identity/server";
import { exhaustiveCheck } from "../../../utils/exhaustiveCheck";
import { RevealMessage } from "./RevealMessage";
import { DemonMessage } from "./DemonMessage";

interface PlayerMessageFlowProps {
  message: PlayerMessage;
  player: string;
}
export function PlayerMessageFlow({ message, player }: PlayerMessageFlowProps) {
  switch (message.type) {
    case "reveal-role":
      return <RevealMessage message={message} player={player} />;
    case "demon-first-night":
      return <DemonMessage message={message} player={player} />;
    default:
      exhaustiveCheck(message);
  }
}
