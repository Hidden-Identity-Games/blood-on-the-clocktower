import { Callout } from "@radix-ui/themes";
import AddPlayer from "./AddPlayer";
import PlayerRole from "./PlayerRole";
import { useSelf } from "./store/useStore";
import AvailableCharacters from "./assets/gameScripts/trouble-brewing.json";

function PlayerLanding() {
  const self = useSelf("test-game");

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

export default PlayerLanding;
