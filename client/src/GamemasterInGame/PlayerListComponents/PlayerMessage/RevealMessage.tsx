import { PlayerMessageMap, Role } from "@hidden-identity/server";
import { useDefiniteGame } from "../../../store/GameContext";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { Flex, Heading, IconButton } from "@radix-ui/themes";
import { useState } from "react";
import { PlayerSelect, RoleSelect } from "./RoleSelect";
import { pick, pluck } from "../../../utils/shuffleList";
import { PlusIcon } from "@radix-ui/react-icons";

export interface RevealMessageProps {
  message: PlayerMessageMap["reveal-role"];
  player: string;
}
export function RevealMessage({ message, player }: RevealMessageProps) {
  const { game, gameId, script } = useDefiniteGame();
  const [role, setRole] = useState<Role>(() =>
    pluck(
      script
        .map(({ id }) => id)
        .filter((role) => role !== game.playersToRoles[player]),
    ),
  );
  const [players, setPlayers] = useState<string[]>(() =>
    pick(
      message.count,
      game.playerList.filter((p) => p !== player),
    ),
  );

  return (
    <Flex direction="column" gap="2">
      <PlayerMessageLink
        className="mb-2"
        note={{
          player,
          reveal: {
            Reveal: players.map((p) => ({ character: role, player: p })),
          },
          message: "",
        }}
        gameId={gameId}
      />
      <Heading>Role</Heading>
      {/* <Text>Restrictions: {message.restriction}</Text> */}
      <RoleSelect
        currentRole={role}
        onSelect={(nextRole) => setRole(nextRole)}
      />

      <Heading className="flex items-center gap-1">
        Player{" "}
        <IconButton
          variant="ghost"
          radius="full"
          className="pt-1"
          onClick={() => {
            setPlayers((lastPlayers) => [
              ...lastPlayers,
              pluck(game.playerList.filter((p) => !lastPlayers.includes(p))),
            ]);
          }}
        >
          <PlusIcon />
        </IconButton>
      </Heading>

      {players.map((currentPlayer, index) => (
        <PlayerSelect
          clearable
          key={currentPlayer}
          currentPlayer={currentPlayer}
          onSelect={(nextPlayer) => {
            setPlayers((lastPlayers) => {
              const nextPlayers = [...lastPlayers];
              nextPlayers[index] = nextPlayer!;
              return nextPlayers.filter((p): p is string => !!p);
            });
          }}
        />
      ))}
    </Flex>
  );
}
