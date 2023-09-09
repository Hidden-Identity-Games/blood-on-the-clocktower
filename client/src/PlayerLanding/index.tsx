import { Callout } from "@radix-ui/themes";
import AddPlayer from "./AddPlayer";
import PlayerRole from "./PlayerRole";
import { useSelf } from "../store/useStore";
import { GameProvider } from "../store/GameContextProvider";
import { useParams } from "react-router-dom";
import { useSecretKey } from "../store/secretKey";
import { GameHeader } from "../shared/GameHeader";
import { PageLoader } from "../shared/PageLoader";
export function GameMasterRoot() {}
export function PlayerRoot() {
  const { gameId } = useParams();
  return (
    <GameProvider gameId={gameId!}>
      <GameHeader />
      <PlayerLanding />
    </GameProvider>
  );
}

function PlayerLanding() {
  const [secretKey, setSecretKey] = useSecretKey();
  const self = useSelf(secretKey);

  if (!self) return <PageLoader />;

  if (!self.name)
    return <AddPlayer secretKey={secretKey} setSecretKey={setSecretKey} />;

  if (!self.role)
    return (
      <Callout.Root>
        <Callout.Text>Waiting for game to begin...</Callout.Text>
      </Callout.Root>
    );

  return <PlayerRole role={self.role} />;
}
