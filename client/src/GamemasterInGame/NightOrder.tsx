import React from "react";
import { getRole, getRoleExtension } from "../assets/game_data/gameData";
import { IngamePlayerList } from "./PlayerList";
import { Button, Flex } from "@radix-ui/themes";
import { useDefiniteGame } from "../store/GameContext";
import { useSetGameStatus } from "../store/useStore";

export function NightOrder() {
  const { game } = useDefiniteGame();
  const [checkedPlayers, setCheckedPlayers] = React.useState<
    Record<string, boolean>
  >({});
  const [nightTime, setNightTime] = React.useState(false);
  const [, , , setGameStatus] = useSetGameStatus();

  const playerOrder = Object.entries(game.playersToRoles).map(
    ([player, role]) => ({
      player,
      role,
      ...getRole(role),
      ...getRoleExtension(role),
    }),
  );

  const startNight = () => {
    setNightTime(true);
    setCheckedPlayers(
      Object.fromEntries(
        playerOrder
          .filter(({ player }) => !game.deadPlayers[player])
          .filter(({ firstNight, otherNight }) =>
            game.gameStatus === "Setup" ? firstNight !== 0 : otherNight !== 0,
          )
          .map(({ player }) => [player, true]),
      ),
    );
  };

  return (
    <Flex gap="2" direction="column" p="2" className="w-full">
      {!nightTime && (
        <Button
          onClick={() => {
            startNight();
          }}
        >
          Start {game.gameStatus === "Started" ? "" : "first"} night
        </Button>
      )}

      <IngamePlayerList
        night={
          nightTime ? (game.gameStatus === "Setup" ? "first" : "other") : null
        }
        checkedPlayers={checkedPlayers}
        setCheckedPlayers={setCheckedPlayers}
      />
      {nightTime && (
        <Button
          onClick={() => {
            if (game.gameStatus === "Setup") {
              setGameStatus("Started");
            }
            setNightTime(false);
            setCheckedPlayers({});
          }}
        >
          Day time
        </Button>
      )}
      {nightTime && (
        <Button
          onClick={() => {
            setGameStatus("Setup");
            setNightTime(false);
            setCheckedPlayers({});
          }}
        >
          Back to first day
        </Button>
      )}
    </Flex>
  );
}
