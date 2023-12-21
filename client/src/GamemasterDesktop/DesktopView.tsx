import { CircularLayout, PlaceInCenter } from "../shared/PlayersInCircle";
import { useGame } from "../store/GameContext";
import { LoadingExperience } from "../shared/LoadingExperience";
import { Button, Flex, Text } from "@radix-ui/themes";
import { usePlayerOrder } from "../shared/PlayerListOrder";
import { NightOrder } from "../GamemasterInGame/NightOrder";
import { useFirstSeat, useIsHiddenView, useSearchParams } from "../store/url";
import { Lobby } from "../GamemasterInGame/Lobby";
import { TeamDistributionBar } from "../shared/TeamDistributionBar";
import { ExecutionInfo } from "../shared/ExecutionInfo";
import { SpectatorTile } from "../shared/PlayersInCircle/SpectatorTile";
import { GMTile } from "../shared/PlayersInCircle/GMTile";
import React from "react";
import { ControlledSheet } from "../shared/Sheet/ControlledSheet";

function HideShowButton() {
  const [_, setSearchParams] = useSearchParams();
  const [isHiddenView, setIsHiddenView] = useIsHiddenView();
  return isHiddenView ? (
    <Button
      onClick={() => {
        // uggh https://github.com/remix-run/react-router/issues/9757
        setSearchParams({ hiddenView: undefined, sheetView: undefined });
      }}
    >
      Show
    </Button>
  ) : (
    <Button
      onClick={() => {
        setIsHiddenView(true);
      }}
    >
      Hide
    </Button>
  );
}

interface DesktopViewProps {
  isPlayerView?: boolean;
}
export function DesktopView({ isPlayerView = true }: DesktopViewProps) {
  return (
    <div className=" relative flex min-h-0 flex-1 justify-between gap-4 overflow-hidden">
      <Flex className="hidden flex-1 lg:flex">
        <Grimoire isPlayerView={isPlayerView} />
      </Flex>
      <div className="flex h-full w-full min-w-[400px] shrink grow overflow-hidden empty:hidden md:grow-0 lg:w-1/4">
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
      {game.gameStatus === "PlayersJoining" ? <Lobby /> : <NightOrder />}
      <ControlledSheet />
    </div>
  );
}

interface GrimoireProps {
  isPlayerView?: boolean;
}
function Grimoire({ isPlayerView = true }: GrimoireProps) {
  const { game } = useGame();
  const [firstSeat] = useFirstSeat();
  const [_isHiddenView] = useIsHiddenView();
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
            {!isPlayerView && <HideShowButton />}
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
