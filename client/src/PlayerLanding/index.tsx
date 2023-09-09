import { Callout } from "@radix-ui/themes";
import AddPlayer from "./AddPlayer";
import PlayerRole from "./PlayerRole";
import { useSelf } from "../store/useStore";
import { GameProvider } from "../store/GameContextProvider";
import { useParams } from "react-router-dom";
import { roles } from "../assets/game_data/gameData";
import { usePlayerName } from "../store/playerName";
import { OrderPlayers } from "./OrderPlayers";
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
  const [playerName, setPlayerName] = usePlayerName();
  const self = useSelf(playerName);

  if (!self) return <div>Loading...</div>;

  if (!self.name)
    return <AddPlayer playerName={playerName} setPlayerName={setPlayerName} />;

  if (!self.role)
    return (
      <>
        <Callout.Root>
          <Callout.Text>Waiting for game to begin...</Callout.Text>
        </Callout.Root>
        <OrderPlayers myName={self.name} />
      </>
    );

  return <PlayerRole self={self} characters={Object.values(roles)} />;
}
