import { type CharacterActionQueueItem } from "@hidden-identity/shared";

import { PlayerList } from "../../../../GMRoute/GMShared/PlayerListComponents";
import { useDefiniteGame } from "../../../../store/GameContext";
import { PlayerNameWithRoleIcon, RoleName } from "../../../RoleIcon";
import { SheetBody, SheetContent, SheetHeader } from "../../SheetBody";

export interface PlayerSheetProps {
  action: CharacterActionQueueItem;
}

function Header({ action }: PlayerSheetProps) {
  const { game } = useDefiniteGame();
  return (
    <div className="flex h-full items-center gap-1 bg-[--color-background]">
      <PlayerNameWithRoleIcon player={action.player} className="grow-0" />(
      {RoleName(game.playersToRoles[action.player])})
    </div>
  );
}

function Body({ action }: PlayerSheetProps) {
  return <PlayerList.NightReminder player={action.player} />;
}

export function PlayerActionSheet({ action }: PlayerSheetProps) {
  const { game } = useDefiniteGame();

  if (!Reflect.has(game.playersToRoles, action.player)) {
    console.error(`player not found ${action.player}`);
    return null;
  }
  return (
    <SheetBody>
      <SheetContent>
        <Body action={action} />
      </SheetContent>
      <SheetHeader>
        <Header action={action} />
      </SheetHeader>
    </SheetBody>
  );
}
