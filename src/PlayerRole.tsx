import { Character } from "./types/script";
import "./PlayerRole.css";
import { useSecretKey } from "./store/secretKey";
import { usePlayers, useSelf } from "./store/useStore";

interface PlayerRoleProps {}

function PlayerRole(props: PlayerRoleProps) {
  const self = useSelf("test-game");
  const secretKey = useSecretKey();

  return (
    <>
      <div>
        {secretKey}
        Hello {self.name}, welcome to the game! Please press the screen to see
        your role.
      </div>
      <div className="role">You are the {self.role}</div>
    </>
  );
}

export default PlayerRole;
