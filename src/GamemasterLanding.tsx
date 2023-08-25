import { Flex } from "@radix-ui/themes";
import PlayerMap from "./PlayerMap";
import ConfirmButton from "./ConfirmButton";

function GamemasterLanding() {
  return (
    <Flex direction="column">
      <ConfirmButton handleConfirm={() => {}}>New Game</ConfirmButton>
      <PlayerMap />
    </Flex>
  );
}

export default GamemasterLanding;
