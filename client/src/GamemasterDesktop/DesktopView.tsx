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
import { PlayerList } from "../GamemasterInGame/PlayerListComponents";
import { NightOrder } from "../GamemasterInGame/NightOrder";
import { GameHeader } from "../shared/GameHeader";

export function DesktopView() {
  const { gameId } = useParams();
  const [search] = useSearchParams();
  const isDayView = search.get("view") !== "night";

  return (
    <GameProvider gameId={gameId!}>
      <Flex direction="column" className="h-full">
        <GameHeader />
        <Flex className="min-h-0 flex-1 overflow-hidden p-1" justify="between">
          <Flex className="flex-1">
            <Grimoire />
          </Flex>
          <Flex className="h-full w-1/4 min-w-[400px] overflow-hidden">
            {!isDayView && <SideBar />}
          </Flex>
        </Flex>
      </Flex>
    </GameProvider>
  );
}

function SideBar() {
  const { game } = useGame();

  if (!game) {
    return <LoadingExperience>Loading</LoadingExperience>;
  }

  return <NightOrder />;
}

function Grimoire() {
  const { game } = useGame();
  const [search, setSearch] = useSearchParams();
  const firstSeat = search.get("firstSeat")?.toLowerCase() ?? "";
  const players = usePlayerOrder("seat order", firstSeat);

  if (!game) {
    return <LoadingExperience>Loading</LoadingExperience>;
  }

  const isDayView = search.get("view") !== "night";
  const showDayswitcher = !!search.get("view");
  const alivePlayers = players.filter((p) => !game.deadPlayers[p]);
  return (
    <Flex className="flex-1" align="center" justify="center" direction="column">
      <CircularLayout className="w-full flex-1">
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
