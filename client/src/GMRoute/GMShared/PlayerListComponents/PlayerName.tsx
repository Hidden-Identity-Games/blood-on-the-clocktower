import classNames from "classnames";
import { AlignmentText } from "../../../shared/RoleIcon";
import { useDefiniteGame } from "../../../store/GameContext";

export function PlayerName({ player }: { player: string }) {
  const { game } = useDefiniteGame();
  const dead = game.deadPlayers[player];
  return (
    <AlignmentText
      player={player}
      className={classNames("flex-1", dead && "line-through")}
    >
      {player}
    </AlignmentText>
  );
}
