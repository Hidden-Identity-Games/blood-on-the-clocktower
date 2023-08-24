import "./PlayerRole.css";
import { useSelf } from "./store/useStore";

interface PlayerRoleProps {}

function PlayerRole(props: PlayerRoleProps) {
  const self = useSelf("test-game");

  return (
    <>
      <div>
        Hello {self.name}, welcome to the game! Please press the screen to see
        your role.
      </div>
      <div className="role">You are the {self.role}</div>
    </>
  );
}

export default PlayerRole;
