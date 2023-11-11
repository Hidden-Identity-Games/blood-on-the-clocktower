import {
  CircularLayout,
  PlaceInCenter,
  PlaceInCircle,
} from "../shared/CircularLayout";
import { useGame } from "../store/GameContext";
import { LoadingExperience } from "../shared/LoadingExperience";
import { Button, Flex } from "@radix-ui/themes";
import { RoleToken } from "../shared/RoleToken";
import { usePlayerOrder } from "../shared/PlayerListOrder";
import { PlayerList } from "../GamemasterInGame/PlayerListComponents";
import { NightOrder } from "../GamemasterInGame/NightOrder";
import { useFirstSeat, useIsHiddenView, useQueryParams } from "../store/url";
import { Lobby } from "../GamemasterInGame/Lobby";
import { TeamDistributionBar } from "../shared/TeamDistributionBar";

interface DesktopViewProps {
  isPlayerView?: boolean;
}
export function DesktopView({ isPlayerView = true }: DesktopViewProps) {
  const [{ hiddenView }] = useQueryParams();

  return (
    <Flex className="min-h-0 flex-1 overflow-hidden p-1" justify="between">
      <Flex className="flex-1">
        <Grimoire isPlayerView={isPlayerView} />
      </Flex>
      {!isPlayerView && (
        <Flex className="h-full w-1/4 min-w-[400px] overflow-hidden">
          {!hiddenView && <SideBar />}
        </Flex>
      )}
    </Flex>
  );
}

function SideBar() {
  const { game } = useGame();

  if (!game) {
    return <LoadingExperience>Loading</LoadingExperience>;
  }

  return game.gameStatus === "PlayersJoining" ? <Lobby /> : <NightOrder />;
}

interface GrimoireProps {
  isPlayerView?: boolean;
}
function Grimoire({ isPlayerView = true }: GrimoireProps) {
  const { game } = useGame();
  const [firstSeat] = useFirstSeat();
  const [_isHiddenView, setIsHiddenView] = useIsHiddenView();
  const hideInfo = _isHiddenView || isPlayerView;
  const players = usePlayerOrder("seat order", firstSeat);

  if (!game) {
    return <LoadingExperience>Loading</LoadingExperience>;
  }

  const alivePlayers = players.filter((p) => !game.deadPlayers[p]);
  return (
    <Flex className="flex-1" align="center" justify="center" direction="column">
      <CircularLayout className="w-full flex-1">
        <PlaceInCenter>
          <Flex direction="column" gap="3">
            {isPlayerView && (
              <>
                <TeamDistributionBar />
                <div className="text-center">
                  <div>Alive players: {alivePlayers.length}</div>
                  <div>{`Votes to execute: ${Math.ceil(
                    alivePlayers.length / 2,
                  )}`}</div>
                </div>
              </>
            )}
            {!isPlayerView && (
              <Button
                onClick={() => {
                  setIsHiddenView(!hideInfo);
                }}
              >
                Switch to {hideInfo ? "Night" : "Day"}
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
                  <button className="h-full w-full" disabled={hideInfo}>
                    <RoleToken
                      isHiddenView={hideInfo}
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
