import { Alignment, PlayerMessageCreatorMap } from "@hidden-identity/shared";
import { AlignmentSelect } from "../../Selectors";
import { useState } from "react";
import { oppositeAlignment } from "@hidden-identity/shared";
import { Flex, Heading } from "@radix-ui/themes";
import { useGetPlayerAlignment } from "../../../../store/useStore";
import { SubmitMessage } from "../messageShared/SubmitMessage";

export interface AlignmentChangeMessageProps {
  message: PlayerMessageCreatorMap["alignment-change"];
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
      <Heading>Alignment</Heading>
      <AlignmentSelect
        currentAlignment={alignment}
        onSelect={(next) => next && setAlignment(next)}
      />
      <SubmitMessage
        player={player}
        message={[{ alignment, group: "You are now" }]}
      />
    </Flex>
  );
}
