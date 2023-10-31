import { useParams } from "react-router-dom";
import { CircularLayout, PlaceInCircle } from "../shared/CircularLayout";
import { useGame } from "../store/GameContext";
import { GameProvider } from "../store/GameContextProvider";
import { LoadingExperience } from "../shared/LoadingExperience";
import { Flex } from "@radix-ui/themes";
import { RoleToken } from "../shared/RoleToken";
import { getCharacter } from "@hidden-identity/shared";

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

  if (!game) {
    return <LoadingExperience>Loading</LoadingExperience>;
  }

  return (
    <Flex className="flex-1" align="center" justify="center" direction="column">
      <CircularLayout className="aspect-square flex-1">
        {Object.entries(game.playersToRoles).map(([player, role], idx) => (
          <PlaceInCircle key={player} num={idx} of={game.playerList.length}>
            <div className="flex h-full w-full flex-col">
              <RoleToken role={role}>
                <div className="line-clamp-1 truncate">{player}</div>
                <div className="line-clamp-1 truncate">
                  {getCharacter(role).name}
                </div>
              </RoleToken>
            </div>
          </PlaceInCircle>
        ))}
      </CircularLayout>
    </Flex>
  );
}
