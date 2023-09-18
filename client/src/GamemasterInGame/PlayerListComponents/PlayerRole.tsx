import { alignmentColorMap } from "../../shared/CharacterTypes";
import { MeaningfulIcon } from "../../shared/MeaningfulIcon";
import { RoleIcon, RoleName } from "../../shared/RoleIcon";
import { useDefiniteGame } from "../../store/GameContext";
import { useGetPlayerAlignment } from "../../store/useStore";

interface PlayerRoleIconProps {
  children: React.ReactNode;
  player: string;
}
export function PlayerRoleIcon({ children, player }: PlayerRoleIconProps) {
  const { game } = useDefiniteGame();
  const getPlayerAlignment = useGetPlayerAlignment();
  const role = game.playersToRoles[player];
  return (
    <MeaningfulIcon
      className="aspect-square p-1 text-xl"
      size="1"
      color={alignmentColorMap[getPlayerAlignment(player)]}
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
