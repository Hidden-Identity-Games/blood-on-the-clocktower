import { getCharacter } from "../../assets/game_data/gameData";
import { MeaningfulIcon } from "../../shared/MeaningfulIcon";
import { RoleIcon, RoleName } from "../../shared/RoleIcon";
import { useDefiniteGame } from "../../store/GameContext";

interface PlayerRoleIconProps {
  children: React.ReactNode;
  player: string;
}
export function PlayerRoleIcon({ children, player }: PlayerRoleIconProps) {
  const { game } = useDefiniteGame();
  const role = game.playersToRoles[player];
  return (
    <MeaningfulIcon
      className="aspect-square p-1 text-xl"
      size="1"
      color={
        ["Townsfolk", "Outsider"].includes(getCharacter(role).team)
          ? "cyan"
          : "crimson"
      }
      header={
        <div className="flex items-center justify-center gap-1">
          <RoleIcon role={role} />
          {RoleName(role)}
        </div>
      }
      explanation={children}
    >
      <RoleIcon role={role} />
    </MeaningfulIcon>
  );
}
