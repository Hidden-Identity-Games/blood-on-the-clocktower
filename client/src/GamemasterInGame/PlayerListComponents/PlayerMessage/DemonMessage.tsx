import { PlayerMessageMap, Role } from "@hidden-identity/server";
import { Flex, Heading } from "@radix-ui/themes";
import { useDefiniteGame } from "../../../store/GameContext";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { getCharacter } from "../../../assets/game_data/gameData";
import { useState } from "react";
import { pick } from "../../../utils/shuffleList";
import { PlayerSelect, RoleSelect } from "./RoleSelect";

export interface DemonMessageProps {
  message: PlayerMessageMap["demon-first-night"];
  player: string;
}
export function DemonMessage({ player }: DemonMessageProps) {
  const { gameId, game, script } = useDefiniteGame();
  const [minions, setMinions] = useState(() =>
    game.playerList.filter(
      (player) => getCharacter(game.playersToRoles[player]).team === "Minion",
    ),
  );
  const rolesInPlay = Object.fromEntries(
    Object.values(game.playersToRoles).map((role) => [role, true]),
  ) as Record<Role, boolean>;
  const [bluffs, setBluffs] = useState(() =>
    pick(
      3,
      script
        .map(({ id }) => id)
        .filter((id) => !rolesInPlay[id])
        .filter(
          (id) =>
            getCharacter(id).team === "Outsider" ||
            getCharacter(id).team === "Townsfolk",
        ),
    ),
  );

  return (
    <Flex direction="column" gap="2">
      <PlayerMessageLink
        className="mb-2"
        gameId={gameId}
        note={{
          player,
          reveal: {
            minions: minions.map((minion) => ({ player: minion })),
            bluffs: bluffs.map((bluff) => ({
              character: bluff,
            })),
          },
          message: "",
        }}
      />
      <Heading>Minions:</Heading>
      {minions.map((name, index) => (
        <PlayerSelect
          currentPlayer={name}
          key={name}
          onSelect={(nextPlayer) => {
            setMinions((value) => {
              const nextValue: (string | null)[] = [...value];
              nextValue[index] = nextPlayer;
              return nextValue.filter((p): p is string => !!p);
            });
          }}
        />
      ))}
      <Heading>Bluffs:</Heading>

      {bluffs.map((role, index) => (
        <RoleSelect
          currentRole={role}
          key={role}
          onSelect={(nextRole) => {
            setBluffs((value) => {
              const nextValue: (Role | null)[] = [...value];
              nextValue[index] = nextRole;
              return nextValue.filter((p): p is Role => !!p);
            });
          }}
        />
      ))}
    </Flex>
  );
}