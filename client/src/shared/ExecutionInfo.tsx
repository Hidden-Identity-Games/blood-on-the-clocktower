import { Text } from "@radix-ui/themes";

import { usePlayerOnBlock } from "../store/useStore";

export function ExecutionInfo() {
  const playerOnBlock = usePlayerOnBlock();

  return (
    <>
      <Text className="capitalize">{`Executing: ${
        playerOnBlock.player ?? "-"
      }`}</Text>
      <Text>
        {`Votes ${playerOnBlock.player ? "to tie" : "to execute"}: ${
          playerOnBlock.votes
        }`}
      </Text>
    </>
  );
}
