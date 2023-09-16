import { Dialog, IconButton } from "@radix-ui/themes";
import { useDefiniteGame } from "../../../store/GameContext";
import { getCharacter } from "../../../assets/game_data/gameData";
import { RiMessage2Fill } from "react-icons/ri";
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
interface PlayerMessageModalProps {
  player: string;
}
export function ShowMessage({ player }: PlayerMessageModalProps) {
  const { game } = useDefiniteGame();
  const role = game.playersToRoles[player];
  const message =
    getCharacter(role)[
      game.gameStatus === "Setup" ? "firstNight" : "otherNight"
    ]?.playerMessage;

  if (!message) {
    return null;
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton>
          <RiMessage2Fill />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content className="m-2">
        <Dialog.Title>Build a note</Dialog.Title>
        <Dialog.Description as="div">
          <PlayerMessageFlow message={message} player={player} />
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  );
}
