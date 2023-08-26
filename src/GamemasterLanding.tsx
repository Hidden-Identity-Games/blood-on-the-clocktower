import { Flex } from "@radix-ui/themes";
import PlayerMap from "./PlayerMap";
import ConfirmButton from "./ConfirmButton";
import CharacterSelectList from "./CharacterSelectList";
import TroubleBrewingScript from "./assets/gameScripts/trouble-brewing.json";
import React from "react";
import { useClearPlayersList, useClearRoles } from "./store/useStore";

function GamemasterLanding() {
  const [showCharSelect, setShowCharSelect] = React.useState(false);
  const [, , , clearPlayers] = useClearPlayersList("test-game");
  const [, , , clearRoles] = useClearRoles("test-game");

  if (showCharSelect)
    return (
      <CharacterSelectList
        scriptJson={TroubleBrewingScript}
        handleFormSubmit={() => {
          setShowCharSelect(false);
        }}
      />
    );

  return (
    <Flex direction="column">
      <ConfirmButton
        handleConfirm={() => {
          clearPlayers();
          clearRoles();
          setShowCharSelect(true);
        }}
      >
        New Game
      </ConfirmButton>
      <PlayerMap />
    </Flex>
  );
}

export default GamemasterLanding;
