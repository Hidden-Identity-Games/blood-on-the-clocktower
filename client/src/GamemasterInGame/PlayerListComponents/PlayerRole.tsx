import { Button } from "@radix-ui/themes";
import { alignmentColorMap } from "../../shared/CharacterTypes";
import { MeaningfulIcon } from "../../shared/MeaningfulIcon";
import {
  PlayerNameWithRoleIcon,
  RoleIcon,
  RoleName,
} from "../../shared/RoleIcon";
import { Sheet } from "../../shared/Sheet";
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
    <Sheet.Root>
      <Sheet.Trigger>
        <Button
          variant="surface"
          className="aspect-square p-1 text-xl"
          color={alignmentColorMap[getPlayerAlignment(player)]}
          radius="full"
        >
          <RoleIcon role={role} />
        </Button>
      </Sheet.Trigger>
      <Sheet.Content
        title={
          <div className="flex h-full items-center gap-1">
            <PlayerNameWithRoleIcon player={player} className="grow-0" />(
            {RoleName(role)})
          </div>
        }
      >
        {children}
      </Sheet.Content>
    </Sheet.Root>
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
