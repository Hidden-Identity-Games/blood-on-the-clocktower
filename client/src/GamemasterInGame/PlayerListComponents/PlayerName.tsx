import classNames from "classnames";
import { RoleText } from "../../shared/RoleIcon";
import { useDefiniteGame } from "../../store/GameContext";

export function PlayerName({ player }: { player: string }) {
  const { game } = useDefiniteGame();
  const role = game.playersToRoles[player];
  const dead = game.deadPlayers[player];
  return (
    <RoleText
      className={classNames("flex-1", dead && "line-through")}
      role={role}
    >
      {player}
    </RoleText>
  );
}
