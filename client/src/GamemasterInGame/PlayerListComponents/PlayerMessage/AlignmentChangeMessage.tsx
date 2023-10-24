import { Alignment, PlayerMessageMap, Reveal } from "@hidden-identity/server";
import { AlignmentSelect } from "../Selectors";
import { useState } from "react";
import { oppositeAlignment } from "../../../assets/game_data/gameData";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { Flex, Heading } from "@radix-ui/themes";
import { useGetPlayerAlignment } from "../../../store/useStore";

export interface AlignmentChangeMessageProps {
  message: PlayerMessageMap["alignment-change"];
  player: string;
  openMessageCallback?: (
    message: string,
    reveal: Record<string, Reveal[]>,
  ) => void;
}

export function AlignmentChangeMessage({
  player,
  openMessageCallback,
}: AlignmentChangeMessageProps) {
  const getPlayerAlignment = useGetPlayerAlignment();
  const [alignment, setAlignment] = useState<Alignment>(
    oppositeAlignment(getPlayerAlignment(player)),
  );

  const text = "";
  const reveal = {
    "You are now": [
      {
        alignment,
      },
    ],
  };

  return (
    <Flex direction="column" gap="2">
      <PlayerMessageLink
        className="mb-2"
        note={{
          reveal: reveal,
          message: text,
        }}
        callback={
          openMessageCallback
            ? () => openMessageCallback(text, reveal)
            : undefined
        }
      />
      <Heading>Alignment</Heading>
      <AlignmentSelect
        currentAlignment={alignment}
        onSelect={(next) => next && setAlignment(next)}
      />
    </Flex>
  );
}
