import { Button, Callout, Flex, Heading, Separator } from "@radix-ui/themes";
import PlayerRoleMap from "./PlayerRoleMap";
import ConfirmButton from "./ConfirmButton";
import CharacterSelectList from "./CharacterSelectList";
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
import ScriptSelectList from "./ScriptSelectList";

function GamemasterLanding() {
  const [showCharSelect, setShowCharSelect] = React.useState(false);
  const [scriptsSelected, setScriptsSelected] = React.useState<string[]>([]);

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
          setScriptsSelected([]);
        }}
      >
        New Game
      </ConfirmButton>
    );
  }

  if (showCharSelect)
    return (
      <Flex direction="column" gap="3">
        <Heading size={"4"} align={"center"} color="tomato">
          Scripts
        </Heading>
        <ScriptSelectList
          handleSubmit={(selected) =>
            setScriptsSelected(
              Object.keys(selected).filter((script) => selected[script])
            )
          }
        />
        <Separator size="4" color="tomato" />
        <Heading size={"4"} align={"center"} color="tomato">
          Roles
        </Heading>
        <CharacterSelectList
          selectedScripts={scriptsSelected}
          handleFormSubmit={() => {
            setShowCharSelect(false);
          }}
        />
      </Flex>
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
