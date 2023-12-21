import { Flex, Text } from "@radix-ui/themes";
import { HTMLAttributes } from "react";
import { FaFeather } from "react-icons/fa6";

import { useDefiniteGame } from "../../../store/GameContext";
import { PlayerStatusIcons } from "../../GMInGame/NotesIcons";
import { PlayerList } from ".";

interface PlayerNotesProps extends HTMLAttributes<HTMLDivElement> {
  player: string;
}

export function PlayerNotes({ player, ...props }: PlayerNotesProps) {
  const { game } = useDefiniteGame();
  const statuses = game.playerPlayerStatuses[player] ?? [];
  const notes = game.playerNotes[player] ?? "";
  if (!notes && !statuses.length) return;

  return (
    <Text size="2" weight="light" asChild>
      <Flex direction="column" gap="2" {...props}>
        {statuses.length > 0 && (
          <Flex gap="3">
            <PlayerStatusIcons player={player} />
          </Flex>
        )}
        {notes && (
          <PlayerList.NoteInputModal player={player}>
            <button className="ml-1 flex-1 whitespace-pre-line text-left">
              <Flex gap="2">
                <FaFeather />
                {notes}
              </Flex>
            </button>
          </PlayerList.NoteInputModal>
        )}
      </Flex>
    </Text>
  );
}
