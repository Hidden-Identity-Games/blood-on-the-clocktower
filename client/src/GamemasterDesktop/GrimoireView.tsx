import { useParams } from "react-router-dom";
import {
  CircularLayout,
  PlaceInCenter,
  PlaceInCircle,
} from "../shared/CircularLayout";
import { useGame } from "../store/GameContext";
import { GameProvider } from "../store/GameContextProvider";
import { LoadingExperience } from "../shared/LoadingExperience";
import { Flex } from "@radix-ui/themes";
import { RoleToken } from "../shared/RoleToken";
import { getCharacter } from "@hidden-identity/shared";
import { usePlayerOrder } from "../shared/PlayerListOrder";
import React from "react";

export function GrimoireView() {
  const { gameId } = useParams();
  return (
    <GameProvider gameId={gameId!}>
      <Grimoire />
    </GameProvider>
  );
}

function Grimoire() {
  const { game } = useGame();
  const [firstSeat, _setFirstSeat] = React.useState("");
  const players = usePlayerOrder("seat order", firstSeat);

  if (!game) {
    return <LoadingExperience>Loading</LoadingExperience>;
  }

  return (
    <Flex className="flex-1" align="center" justify="center" direction="column">
      <CircularLayout className="aspect-square flex-1">
        <PlaceInCenter>This is the center</PlaceInCenter>
        <>
          {players.map((player, idx) => (
            <PlaceInCircle
              key={player}
              index={idx}
              totalCountInCircle={players.length}
            >
              <div className="flex h-full w-full">
                <RoleToken role={game.playersToRoles[player]}>
                  <div className="line-clamp-1 truncate">{player}</div>
                  <div className="line-clamp-1 truncate">
                    {getCharacter(game.playersToRoles[player]).name}
                  </div>
                </RoleToken>
              </div>
            </PlaceInCircle>
          ))}
        </>
      </CircularLayout>
    </Flex>
  );
}
