import { CircularLayout, PlaceInCenter } from "../shared/PlayersInCircle";
import { useGame } from "../store/GameContext";
import { LoadingExperience } from "../shared/LoadingExperience";
import { Button, Flex, Text } from "@radix-ui/themes";
import { usePlayerOrder } from "../shared/PlayerListOrder";
import { NightOrder } from "../GamemasterInGame/NightOrder";
import { useFirstSeat, useIsHiddenView } from "../store/url";
import { Lobby } from "../GamemasterInGame/Lobby";
import { TeamDistributionBar } from "../shared/TeamDistributionBar";
import { ExecutionInfo } from "../shared/ExecutionInfo";
import { SpectatorTile } from "../shared/PlayersInCircle/SpectatorTile";
import { GMTile } from "../shared/PlayersInCircle/GMTile";
import React from "react";
import { ControlledSheet } from "../shared/Sheet/ControlledSheet";

interface DesktopViewProps {
  isPlayerView?: boolean;
}
export function DesktopView({ isPlayerView = true }: DesktopViewProps) {
  return (
    <div className=" relative flex min-h-0 flex-1 justify-between gap-4 overflow-hidden">
      <Flex className="hidden lg:flex lg:flex-1">
        <Grimoire isPlayerView={isPlayerView} />
      </Flex>
      <div className="flex h-full w-1/4 min-w-[400px] shrink grow overflow-hidden empty:hidden md:grow-0">
        <SideBar />
      </div>
    </div>
  );
}

function SideBar() {
  const { game } = useGame();

  if (!game) {
    return <LoadingExperience>Loading</LoadingExperience>;
  }

  return (
    <div className="relative flex h-full w-full">
      <ControlledSheet />
      {game.gameStatus === "PlayersJoining" ? <Lobby /> : <NightOrder />}
    </div>
  );
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
      <CircularLayout className="w-full flex-1" totalItems={players.length}>
        <PlaceInCenter>
          <Flex direction="column" gap="3">
            {isPlayerView && (
              <>
                <TeamDistributionBar />
                <Flex className="text-center" gap="0" direction="column">
                  <Text>Alive players: {alivePlayers.length}</Text>
                  <Flex justify="between" p="2" direction="column" gap="2">
                    <ExecutionInfo />
                  </Flex>
                </Flex>
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
            <React.Fragment key={player}>
              {hideInfo ? (
                <SpectatorTile player={player} index={idx} />
              ) : (
                <GMTile player={player} index={idx} />
              )}
            </React.Fragment>
          ))}
        </>
      </CircularLayout>
    </Flex>
  );
}
