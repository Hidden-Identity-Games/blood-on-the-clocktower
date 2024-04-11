import { Button, Flex, Text } from "@radix-ui/themes";
import classNames from "classnames";

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
import { GMTile, HiddenTile } from "./PlayersInCircle/GMTile";
import { SpectatorTile } from "./PlayersInCircle/SpectatorTile";

function HideShowButton() {
  const [_, setSearchParams] = useSearchParams();
  const [isHiddenView, setIsHiddenView] = useIsHiddenView();
  return isHiddenView ? (
    <Button
      onClick={() => {
        setIsHiddenView(false);
      }}
    >
      Show
    </Button>
  ) : (
    <Button
      className="w-fit"
      onClick={() => {
        // uggh https://github.com/remix-run/react-router/issues/9757
        setSearchParams({ hiddenView: "true", sheetView: undefined });
      }}
    >
      Hide
    </Button>
  );
}

export interface GrimoireProps {
  hideCenter?: boolean;
}
export function GMGrimoire({ hideCenter }: GrimoireProps) {
  const { game } = useGame();
  const [firstSeat] = useFirstSeat();
  const [isHiddenView] = useIsHiddenView();
  const players = usePlayerOrder("seat order", firstSeat);

  if (!game) {
    return <LoadingExperience>Loading</LoadingExperience>;
  }
  const alivePlayers = players.filter((p) => !game.deadPlayers[p]);

  return (
    <Flex
      className="w-full flex-1"
      align="center"
      justify="center"
      direction="column"
    >
      <CircularLayout
        className="h-full w-full flex-1"
        totalItems={players.length}
      >
        {!hideCenter && (
          <PlaceInCenter>
            <div className="flex flex-col items-center gap-2">
              <HideShowButton />
              <div
                className={classNames(
                  isHiddenView && "*:opacity-0",
                  "contents",
                )}
              >
                <div className="text-2xl">
                  Alive players: {alivePlayers.length}
                </div>

                <ExecutionInfo />
              </div>
            </div>
          </PlaceInCenter>
        )}
        <>
          {players.map((player, idx) =>
            isHiddenView ? (
              <HiddenTile player={player} index={idx} />
            ) : (
              <GMTile player={player} index={idx} key={player} />
            ),
          )}
        </>
      </CircularLayout>
    </Flex>
  );
}

export function SpectatorGrimoire() {
  const { game } = useGame();
  const [firstSeat] = useFirstSeat();
  const players = usePlayerOrder("seat order", firstSeat);

  if (!game) {
    return <LoadingExperience>Loading</LoadingExperience>;
  }

  const alivePlayers = players.filter((p) => !game.deadPlayers[p]);
  const isNight = game.time.time === "night";

  return (
    <Flex
      className="w-full flex-1"
      align="center"
      justify="center"
      direction="column"
    >
      <CircularLayout
        className="h-full w-full flex-1"
        totalItems={players.length}
      >
        <PlaceInCenter>
          <Flex direction="column" gap="3">
            {isNight ? (
              "Information hidden during night time"
            ) : (
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
          </Flex>
        </PlaceInCenter>
        <>
          {players.map((player, idx) =>
            isNight ? (
              <HiddenTile player={player} index={idx} key={player} />
            ) : (
              <SpectatorTile player={player} index={idx} key={player} />
            ),
          )}
        </>
      </CircularLayout>
    </Flex>
  );
}
