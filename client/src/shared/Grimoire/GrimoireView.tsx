import { Button, Flex, Text } from "@radix-ui/themes";
import React from "react";

import { useGame } from "../../store/GameContext";
import {
  useFirstSeat,
  useIsHiddenView,
  useSearchParams,
} from "../../store/url";
import { ExecutionInfo } from "../ExecutionInfo";
import { LoadingExperience } from "../LoadingExperience";
import { usePlayerOrder } from "../PlayerListOrder";
import { TeamDistributionBar } from "../TeamDistributionBar";
import { CircularLayout, PlaceInCenter } from "./PlayersInCircle";
import { GMTile } from "./PlayersInCircle/GMTile";
import { SpectatorTile } from "./PlayersInCircle/SpectatorTile";

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

export interface GrimoireProps {
  isPlayerView?: boolean;
}
export function Grimoire({ isPlayerView = true }: GrimoireProps) {
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
