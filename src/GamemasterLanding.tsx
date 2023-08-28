import { Button, Callout, Flex } from "@radix-ui/themes";
import PlayerRoleMap from "./PlayerRoleMap";
import ConfirmButton from "./ConfirmButton";
import CharacterSelectList from "./CharacterSelectList";
import TroubleBrewingScript from "./assets/gameScripts/trouble-brewing.json";
import React from "react";
import {
  useAvailableRoles,
  useClearPlayerRoles,
  useClearPlayersList,
  useDistributeRoles,
  usePlayers,
  useRoles,
} from "./store/useStore";
import PlayerList from "./PlayerList";

function GamemasterLanding() {
  const [showCharSelect, setShowCharSelect] = React.useState(false);
  const players = usePlayers("test-game");
  const availableRoles = useAvailableRoles("test-game");
  const rolesMap = useRoles("test-game");
  const [, , , clearPlayers] = useClearPlayersList("test-game");
  const [, , , clearPlayerRoles] = useClearPlayerRoles("test-game");
  const distributeRoles = useDistributeRoles("test-game");

  function NewGameButton() {
    return (
      <ConfirmButton
        handleConfirm={() => {
          clearPlayerRoles();
          clearPlayers();
          setShowCharSelect(true);
        }}
      >
        New Game
      </ConfirmButton>
    );
  }

  if (showCharSelect)
    return (
      <CharacterSelectList
        scriptJson={TroubleBrewingScript}
        handleFormSubmit={() => {
          setShowCharSelect(false);
        }}
      />
    );

  if (Object.keys(rolesMap ?? {}).length === 0) {
    const playersJoinedCount = Object.keys(players ?? {}).length;
    const expectedPlayerCount = availableRoles?.roles.length ?? "X";

    return (
      <Flex direction={"column"}>
        <NewGameButton />
        <PlayerList players={players} />
        <Callout.Root>
          <Callout.Text>
            {playersJoinedCount} / {expectedPlayerCount} players joined.
          </Callout.Text>
        </Callout.Root>
        <Button
          onClick={distributeRoles}
          disabled={playersJoinedCount !== expectedPlayerCount}
        >
          Distribute Roles
        </Button>
      </Flex>
    );
  }

  return (
    <Flex direction="column">
      <NewGameButton />
      <PlayerRoleMap players={players} roles={rolesMap} />
    </Flex>
  );
}

export default GamemasterLanding;
