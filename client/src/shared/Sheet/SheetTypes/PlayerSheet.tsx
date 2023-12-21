import { PlayerList } from "../../../GMRoute/GMShared/PlayerListComponents";
import { useDefiniteGame } from "../../../store/GameContext";
import { PlayerNameWithRoleIcon, RoleName } from "../../RoleIcon";
import { SheetBody, SheetContent, SheetHeader } from "../SheetBody";

export interface PlayerSheetProps {
  player: string;
}

function Header({ player }: PlayerSheetProps) {
  const { game } = useDefiniteGame();
  return (
    <div className="flex h-full items-center gap-1 bg-[--color-background]">
      <PlayerNameWithRoleIcon player={player} className="grow-0" />(
      {RoleName(game.playersToRoles[player])})
    </div>
  );
}

function Body({ player }: PlayerSheetProps) {
  return <PlayerList.NightReminder player={player} />;
}

export function PlayerSheet({ player }: PlayerSheetProps) {
  const { game } = useDefiniteGame();

  if (!Reflect.has(game.playersToRoles, player)) {
    console.error(`player not found ${player}`);
    return null;
  }
  return (
    <SheetBody>
      <SheetContent>
        <Body player={player} />
      </SheetContent>
      <SheetHeader>
        <Header player={player} />
      </SheetHeader>
    </SheetBody>
  );
}
