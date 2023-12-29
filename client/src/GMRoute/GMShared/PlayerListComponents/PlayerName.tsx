import classNames from "classnames";

import { AlignmentText } from "../../../shared/RoleIcon";
import { useDefiniteGame } from "../../../store/GameContext";

export function PlayerName({
  player,
  className,
}: {
  player: string;
  className?: string;
}) {
  const { game } = useDefiniteGame();
  const dead = game.deadPlayers[player];
  return (
    <AlignmentText
      player={player}
      className={classNames("flex-1", dead && "line-through", className)}
    >
      {player}
    </AlignmentText>
  );
}
