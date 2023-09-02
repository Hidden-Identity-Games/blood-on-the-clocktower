import {
  Button,
  Callout,
  Flex,
  Heading,
  Link,
  Separator,
} from "@radix-ui/themes";
import PlayerRoleMap from "./PlayerRoleMap";
import ConfirmButton from "./ConfirmButton";
import CharacterSelectList from "./CharacterSelectList";
import React from "react";
import { useCreateGame, useDistributeRoles, useGame } from "../store/useStore";
import PlayerList from "./PlayerList";
import ScriptSelectList from "./ScriptSelectList";
import { useParams } from "react-router-dom";
import { GameProvider } from "../store/GameContextProvider";

function NewGameButton() {
  const [, , , createGame] = useCreateGame();

  return (
    <ConfirmButton
      handleConfirm={() => {
        createGame();
      }}
    >
      New Game
    </ConfirmButton>
  );
}

export function GameMasterRoot() {
  const { gameId, gmHash } = useParams();
  return (
    <GameProvider gameId={gameId!}>
      <GamemasterLanding providedGMHash={gmHash!} />
    </GameProvider>
  );
}
function GamemasterLanding({ providedGMHash }: { providedGMHash: string }) {
  const [showCharSelect, setShowCharSelect] = React.useState(false);
  const [scriptsSelected, setScriptsSelected] = React.useState<string[]>([]);
  const { gameId, game } = useGame();

  const availableRoles = [];
  const [, , , distributeRoles] = useDistributeRoles();

  if (!game) {
    return <div>Loading...</div>;
  }
  const { players, playersToRoles } = game;
  if (providedGMHash !== game.gmSecretHash) {
    return <div>You are in the wrong place</div>;
  }

  if (showCharSelect)
    return (
      <Flex direction="column" gap="3">
        <Heading size={"4"} align={"center"} color="tomato">
          Scripts
        </Heading>
        <ScriptSelectList
          handleChange={(selected) =>
            setScriptsSelected(
              Object.keys(selected).filter((script) => selected[script]),
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

  if (Object.keys(playersToRoles ?? {}).length === 0) {
    const playersJoinedCount = Object.keys(players ?? {}).length;
    const expectedPlayerCount = availableRoles?.length ?? "X";

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
          onClick={() => distributeRoles([])}
          disabled={playersJoinedCount !== expectedPlayerCount}
        >
          Distribute Roles
        </Button>
        <Link href={`/${gameId}`}>Join game</Link>
      </Flex>
    );
  }

  return (
    <Flex direction="column">
      <NewGameButton />
      {players && playersToRoles ? (
        <PlayerRoleMap players={players} roles={playersToRoles} />
      ) : (
        <span>Loading...</span>
      )}
      <Link href={`/${gameId}`}>Join game</Link>
    </Flex>
  );
}

export default GamemasterLanding;
