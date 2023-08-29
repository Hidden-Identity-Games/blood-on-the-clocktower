import { Callout } from "@radix-ui/themes";
import AddPlayer from "./AddPlayer";
import PlayerRole from "./PlayerRole";
import { useSelf } from "./store/useStore";
import { Character } from "./types/script";
import AvailableCharacters from "./assets/game_scripts.json";

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

  return (
    <PlayerRole
      self={self}
      characters={AvailableCharacters.scripts.reduce<Character[]>(
        (acc, { characters }) => {
          acc = [...acc, ...characters];
          return acc;
        },
        []
      )}
    />
  );
}

export default PlayerLanding;
