import { Button } from "@radix-ui/themes";

import { alignmentColorMap } from "../../../shared/CharacterTypes";
import { MeaningfulIcon } from "../../../shared/MeaningfulIcon";
import { RoleIcon, RoleName } from "../../../shared/RoleIcon";
import { useDefiniteGame } from "../../../store/GameContext";
import { useSheetView } from "../../../store/url";
import { useGetPlayerAlignment } from "../../../store/useStore";

interface PlayerRoleIconProps {
  children: React.ReactNode;
  player: string;
}
export function PlayerRoleIcon({ player }: PlayerRoleIconProps) {
  const { game } = useDefiniteGame();
  const getPlayerAlignment = useGetPlayerAlignment();
  const role = game.playersToRoles[player];
  const [_, triggerSheet] = useSheetView();
  return (
    <Button
      onClick={() =>
        triggerSheet({ id: player, type: "action", isOpen: "open" })
      }
      variant="surface"
      className="aspect-square p-1 text-xl"
      color={alignmentColorMap[getPlayerAlignment(player)]}
      radius="full"
    >
      <RoleIcon role={role} />
    </Button>
  );
}

interface PlayerRoleIconProps {
  children: React.ReactNode;
  player: string;
}
export function ForPlayerPlayerRoleIcon({
  children,
  player,
}: PlayerRoleIconProps) {
  const { game } = useDefiniteGame();
  const role = game.playersToRoles[player];
  return (
    <MeaningfulIcon
      className="aspect-square p-1 text-xl"
      size="1"
      color="amber"
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
