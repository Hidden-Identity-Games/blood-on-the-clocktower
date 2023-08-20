import { Character } from "./types/script";
import "./PlayerRole.css";

interface PlayerRoleProps {
  role: Character;
}

function PlayerRole({ role }: PlayerRoleProps) {
  return (
    <>
      <div className="role">You are the {role.name}</div>
    </>
  );
}

export default PlayerRole;
