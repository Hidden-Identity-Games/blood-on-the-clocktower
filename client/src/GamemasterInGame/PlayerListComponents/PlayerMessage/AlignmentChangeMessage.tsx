import { Alignment, PlayerMessageMap } from "@hidden-identity/server";
import { AlignmentSelect } from "../Selectors";
import { useState } from "react";
import { oppositeAlignment } from "../../../assets/game_data/gameData";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { Flex, Heading } from "@radix-ui/themes";
import { useGetPlayerAlignment } from "../../../store/useStore";

export interface AlignmentChangeMessageProps {
  message: PlayerMessageMap["alignment-change"];
  player: string;
}

export function AlignmentChangeMessage({
  player,
}: AlignmentChangeMessageProps) {
  const getPlayerAlignment = useGetPlayerAlignment();
  const [alignment, setAlignment] = useState<Alignment>(
    oppositeAlignment(getPlayerAlignment(player)),
  );

  return (
    <Flex direction="column" gap="2">
      <PlayerMessageLink
        className="mb-2"
        note={{
          reveal: {
            "You are now": [
              {
                alignment,
              },
            ],
          },
          message: "",
        }}
      />
      <Heading>Alignment</Heading>
      <AlignmentSelect
        currentAlignment={alignment}
        onSelect={(next) => next && setAlignment(next)}
      />
    </Flex>
  );
}
