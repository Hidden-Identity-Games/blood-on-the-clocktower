import { useParams, useSearchParams } from "react-router-dom";
import {
  CircularLayout,
  PlaceInCenter,
  PlaceInCircle,
} from "../shared/CircularLayout";
import { useGame } from "../store/GameContext";
import { GameProvider } from "../store/GameContextProvider";
import { LoadingExperience } from "../shared/LoadingExperience";
import { Button, Flex } from "@radix-ui/themes";
import { RoleToken } from "../shared/RoleToken";
import { usePlayerOrder } from "../shared/PlayerListOrder";
import React from "react";
import { PlayerList } from "../GamemasterInGame/PlayerListComponents";

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
  const [search, setSearch] = useSearchParams();
  const [firstSeat, _setFirstSeat] = React.useState("");
  const players = usePlayerOrder("seat order", firstSeat);

  if (!game) {
    return <LoadingExperience>Loading</LoadingExperience>;
  }

  const isDayView = search.get("view") !== "night";
  const showDayswitcher = !!search.get("view");
  const alivePlayers = players.filter((p) => !game.deadPlayers[p]);
  return (
    <Flex className="flex-1" align="center" justify="center" direction="column">
      <CircularLayout className="aspect-square flex-1">
        <PlaceInCenter>
          <Flex direction="column">
            {isDayView && (
              <div className="text-center">
                <div>Alive players: {alivePlayers.length}</div>
                <div>{`Votes to execute: ${Math.ceil(
                  alivePlayers.length / 2,
                )}`}</div>
              </div>
            )}
            {showDayswitcher && (
              <Button
                onClick={() => {
                  search.set("view", isDayView ? "night" : "day");
                  setSearch(search);
                }}
              >
                Switch to {isDayView ? "Night" : "Day"}
              </Button>
            )}
          </Flex>
        </PlaceInCenter>
        <>
          {players.map((player, idx) => (
            <PlaceInCircle
              key={player}
              index={idx}
              totalCountInCircle={players.length}
            >
              <div className="flex h-full w-full">
                <PlayerList.Actions player={player}>
                  <button className="h-full w-full" disabled={isDayView}>
                    <RoleToken
                      isDayView={isDayView}
                      role={game.playersToRoles[player]}
                      player={player}
                    />
                  </button>
                </PlayerList.Actions>
              </div>
            </PlaceInCircle>
          ))}
        </>
      </CircularLayout>
    </Flex>
  );
}
