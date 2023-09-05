import { Callout } from "@radix-ui/themes";
import AddPlayer from "./AddPlayer";
import PlayerRole from "./PlayerRole";
import { useSelf } from "../store/useStore";
import { GameProvider } from "../store/GameContextProvider";
import { useParams } from "react-router-dom";
import { roles } from "../assets/game_data/roles";
import { useSecretKey } from "../store/secretKey";
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
  const [secretKey, setSecretKey] = useSecretKey();
  const self = useSelf(secretKey);

  if (!self) return <div>Loading...</div>;

  if (!self.name)
    return <AddPlayer secretKey={secretKey} setSecretKey={setSecretKey} />;

  if (!self.role)
    return (
      <Callout.Root>
        <Callout.Text>Waiting for game to begin...</Callout.Text>
      </Callout.Root>
    );

  return <PlayerRole self={self} characters={Object.values(roles)} />;
}
