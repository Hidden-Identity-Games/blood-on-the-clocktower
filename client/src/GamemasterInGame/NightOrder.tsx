import React from "react";
import { IngamePlayerList, NightPlayerList } from "./PlayerList";
import { Button, Flex } from "@radix-ui/themes";
import { useDefiniteGame } from "../store/GameContext";
import { useSetGameStatus } from "../store/useStore";
import { GameMasterActions } from "./GameMasterActions";

export function NightOrder() {
  const { game } = useDefiniteGame();

  const [nightTime, setNightTime] = React.useState(false);
  const [, , , setGameStatus] = useSetGameStatus();

  const startNight = () => {
    setNightTime(true);
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
      {nightTime ? <NightPlayerList /> : <IngamePlayerList />}

      {nightTime && (
        <Button
          onClick={() => {
            if (game.gameStatus === "Setup") {
              setGameStatus("Started");
            }
            setNightTime(false);
          }}
        >
          Day time
        </Button>
      )}
      {nightTime ? (
        <Button
          onClick={() => {
            setGameStatus("Setup");
            setNightTime(false);
          }}
        >
          Back to first day
        </Button>
      ) : (
        <GameMasterActions selectedRoles={{}} />
      )}
    </Flex>
  );
}
