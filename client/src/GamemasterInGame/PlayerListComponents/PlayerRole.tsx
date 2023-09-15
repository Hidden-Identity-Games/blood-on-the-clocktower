import { getRole } from "../../assets/game_data/gameData";
import { MeaningfulIcon } from "../../shared/MeaningfulIcon";
import { RoleIcon, RoleName } from "../../shared/RoleIcon";
import { useDefiniteGame } from "../../store/GameContext";
import { PlayerAbility } from "./PlayerAbility";

export function PlayerRoleIcon({
  night,
  player,
}: {
  night?: boolean;
  player: string;
}) {
  const { game } = useDefiniteGame();
  const role = game.playersToRoles[player];
  return (
    <MeaningfulIcon
      className="aspect-square h-4"
      size="1"
      color={
        ["Townsfolk", "Outsider"].includes(getRole(role).team)
          ? "cyan"
          : "crimson"
      }
      header={
        <div className="flex items-center justify-center gap-1">
          <RoleIcon role={role} />
          {RoleName(role)}
        </div>
      }
      explanation={<PlayerAbility player={player} night={night} />}
    >
      <RoleIcon role={role} />
    </MeaningfulIcon>
  );
}
