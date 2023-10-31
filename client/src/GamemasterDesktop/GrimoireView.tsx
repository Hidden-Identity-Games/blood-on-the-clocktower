import { useParams } from "react-router-dom";
import { CircularLayout, PlaceInCircle } from "../shared/CircularLayout";
import { useGame } from "../store/GameContext";
import { GameProvider } from "../store/GameContextProvider";
import { LoadingExperience } from "../shared/LoadingExperience";
import { Flex } from "@radix-ui/themes";

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
    <Flex align="center" justify="center" direction="column">
      <CircularLayout className="h-screen w-screen">
        {game.playerList.map((player, idx) => (
          <PlaceInCircle key={player} num={idx} of={game.playerList.length}>
            {player}
          </PlaceInCircle>
        ))}
      </CircularLayout>
    </Flex>
  );
}
