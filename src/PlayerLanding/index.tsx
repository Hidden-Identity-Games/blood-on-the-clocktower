import { Callout } from "@radix-ui/themes";
import AddPlayer from "./AddPlayer";
import PlayerRole from "./PlayerRole";
import { useSelf } from "../store/useStore";
import AvailableCharacters from "../assets/game_data/roles.json";
import { GameProvider } from "../store/GameContextProvider";
import { useParams } from "react-router-dom";
export function GameMasterRoot() {}
export function PlayerRoot() {
  const { gameId } = useParams();
  return (
    <GameProvider gameId={gameId!}>
      <PlayerLanding />
    </GameProvider>
  );
}
function PlayerLanding() {
  const self = useSelf();

  if (!self) return <div>Loading...</div>;

  if (!self.name) return <AddPlayer handleFormSubmit={() => {}} />;

  if (!self.role)
    return (
      <Callout.Root>
        <Callout.Text>Waiting for game to begin...</Callout.Text>
      </Callout.Root>
    );

  return <PlayerRole self={self} characters={AvailableCharacters.characters} />;
}
