import { Flex, Text } from "@radix-ui/themes";
import { type HTMLAttributes } from "react";
import { FaFeather } from "react-icons/fa6";

import { useDefiniteGame } from "../../../store/GameContext";
import { PlayerList } from ".";

interface PlayerNotesProps extends HTMLAttributes<HTMLDivElement> {
  player: string;
}

export function PlayerNotes({ player, ...props }: PlayerNotesProps) {
  const { game } = useDefiniteGame();
  const notes = game.playerNotes[player] ?? "";
  if (!notes) return;

  return (
    <Text size="2" weight="light" asChild>
      <Flex direction="column" gap="2" {...props}>
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
