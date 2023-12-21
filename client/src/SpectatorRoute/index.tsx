import { Flex, Heading } from "@radix-ui/themes";
import { GameSelect } from "../shared/GameSelect";
import { LoadingExperience } from "../shared/LoadingExperience";
import { useGame } from "../store/GameContext";
import { useSearchParams } from "../store/url";
import { Grimoire } from "../shared/Grimoire/GrimoireView";

function ChooseGameToJoin() {
  const [_, setSearchParams] = useSearchParams();
  return (
    <Flex
      className="mx-auto w-full max-w-[600px] flex-1 p-4"
      direction="column"
      gap="3"
    >
      <GameSelect.Root onSubmit={(gameId) => setSearchParams({ gameId })}>
        <Heading align="center">Game code to spectate</Heading>
        <GameSelect.Input />
        <GameSelect.SubmitButton />
      </GameSelect.Root>
    </Flex>
  );
}

export function SpectatorRoute() {
  const { gameId, game } = useGame();
  if (!gameId) {
    return <ChooseGameToJoin />;
  }

  if (!game) {
    return <LoadingExperience>Loading...</LoadingExperience>;
  }

  return <Grimoire isPlayerView />;
}
