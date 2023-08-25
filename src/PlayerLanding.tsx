import AddPlayer from "./AddPlayer";
import PlayerRole from "./PlayerRole";
import { useSelf } from "./store/useStore";

function PlayerLanding() {
  const self = useSelf("test-game");

  if (!self) return <div>Loading...</div>;

  if (!self.name) return <AddPlayer handleFormSubmit={() => {}} />;

  return <PlayerRole self={self} />;
}

export default PlayerLanding;
