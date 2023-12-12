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
import { useFirstSeat, useIsHiddenView, useSearchParams } from "../store/url";
import { Lobby } from "../GamemasterInGame/Lobby";
import { TeamDistributionBar } from "../shared/TeamDistributionBar";
import { useVotesToExecute } from "../store/actions/gmPlayerActions";
import { SetCountModal } from "../shared/SetCount";

interface DesktopViewProps {
  isPlayerView?: boolean;
}
export function DesktopView({ isPlayerView = true }: DesktopViewProps) {
  const [{ hiddenView }] = useSearchParams();

  return (
    <Flex
      className="min-h-0 flex-1 overflow-hidden p-1"
      justify="between"
      gap="4"
    >
      <Flex className="hidden lg:flex lg:flex-1">
        <Grimoire isPlayerView={isPlayerView} />
      </Flex>
      {!isPlayerView && (
        <Flex className="h-full w-1/4 min-w-[400px] shrink grow overflow-hidden md:grow-0">
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
  const [, , , setVotesToExecute] = useVotesToExecute();

  if (!game) {
    return <LoadingExperience>Loading</LoadingExperience>;
  }

  const alivePlayers = players.filter((p) => !game.deadPlayers[p]);
  const playerOnBlock = Object.entries(game.onTheBlock).reduce<{
    player: string | null;
    votes: number;
  }>(
    (max, current) => {
      if (max.votes === current[1] ?? 0) {
        return {
          player: max.player ? null : current[0],
          votes: max.player ? current[1] + 1 : current[1],
        };
      }
      if (max.votes < current[1]) {
        return { player: current[0], votes: current[1] };
      }
      return max;
    },
    { votes: Math.ceil(alivePlayers.length / 2), player: null },
  );

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
                  <div className="capitalize">{`Currently Executing: ${
                    playerOnBlock.player ?? "-"
                  }`}</div>
                  <div>{`Votes ${
                    playerOnBlock.player ? "to tie" : "to execute"
                  }: ${playerOnBlock.votes}`}</div>
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
                {hideInfo ? (
                  <SetCountModal
                    title="Votes to Execute:"
                    onSet={(votes: number) => setVotesToExecute(player, votes)}
                  >
                    <button className="h-full w-full">
                      <RoleToken
                        isHiddenView={hideInfo}
                        role={game.playersToRoles[player]}
                        player={player}
                      />
                    </button>
                  </SetCountModal>
                ) : (
                  <PlayerList.Actions player={player}>
                    <button className="h-full w-full" disabled={hideInfo}>
                      <RoleToken
                        isHiddenView={hideInfo}
                        role={game.playersToRoles[player]}
                        player={player}
                      />
                    </button>
                  </PlayerList.Actions>
                )}
              </div>
            </PlaceInCircle>
          ))}
        </>
      </CircularLayout>
    </Flex>
  );
}
