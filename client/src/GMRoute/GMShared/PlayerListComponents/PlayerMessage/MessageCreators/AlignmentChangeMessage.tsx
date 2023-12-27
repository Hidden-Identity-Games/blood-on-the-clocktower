import {
  type Alignment,
  type CharacterActionQueueItem,
  type PlayerMessageCreatorMap,
} from "@hidden-identity/shared";
import { oppositeAlignment } from "@hidden-identity/shared";
import { Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";

import { useGetPlayerAlignment } from "../../../../../store/useStore";
import { AlignmentSelect } from "../../Selectors";
import { SubmitMessage } from "../messageShared/SubmitMessage";

export interface AlignmentChangeMessageProps {
  message: PlayerMessageCreatorMap["alignment-change"];
  action: CharacterActionQueueItem;
}

export function AlignmentChangeMessage({
  action,
}: AlignmentChangeMessageProps) {
  const { player } = action;
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
        action={action}
        player={player}
        message={[{ alignment, group: "You are now" }]}
      />
    </Flex>
  );
}
