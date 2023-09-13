import React from "react";
import { getRole, getRoleExtension } from "../assets/game_data/gameData";
import { IngamePlayerList } from "./PlayerList";
import { Button, Flex } from "@radix-ui/themes";
import { useDefiniteGame } from "../store/GameContext";

// interface NightOrderProps {
//   playersToRoles: Record<string, Role>;
//   deadPlayers: Record<string, boolean>;
// }

export function NightOrder() {
  const { game } = useDefiniteGame();
  const [checkedPlayers, setCheckedPlayers] = React.useState<
    Record<string, boolean>
  >({});
  const [nightTime, setNightTime] = React.useState<null | "first" | "other">(
    null,
  );

  const playerOrder = Object.entries(game.playersToRoles).map(
    ([player, role]) => ({
      player,
      role,
      ...getRole(role),
      ...getRoleExtension(role),
    }),
  );

  const startNight = (startingFirstNight: boolean) => {
    setNightTime(startingFirstNight ? "first" : "other");
    setCheckedPlayers(
      Object.fromEntries(
        playerOrder
          .filter(({ player }) => !game.deadPlayers[player])
          .filter(({ firstNight, otherNight }) =>
            startingFirstNight ? firstNight !== 0 : otherNight !== 0,
          )
          .map(({ player }) => [player, true]),
      ),
    );
  };

  return (
    <Flex gap="2" direction="column" p="2" className="w-full">
      {!nightTime && (
        <Button onClick={() => startNight(true)}>Start first night</Button>
      )}
      {!nightTime && (
        <Button onClick={() => startNight(false)}>Start other night</Button>
      )}
      <IngamePlayerList
        playersToRoles={game.playersToRoles}
        deadPlayers={game.deadPlayers}
        night={nightTime}
        checkedPlayers={checkedPlayers}
        setCheckedPlayers={setCheckedPlayers}
      />
      {nightTime && (
        <Button
          onClick={() => {
            setNightTime(null);
            setCheckedPlayers({});
          }}
        >
          Day time
        </Button>
      )}
    </Flex>
  );
}
