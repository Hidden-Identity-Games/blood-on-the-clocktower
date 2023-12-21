import classNames from "classnames";
import { PlayerList } from "../../../GamemasterInGame/PlayerListComponents";
import { useDefiniteGame } from "../../../store/GameContext";
import { PlayerNameWithRoleIcon, RoleName } from "../../RoleIcon";
import { SheetBody } from "../SheetBody";
import { GlobalSheetContext } from "../SheetContext";
import { useContext } from "react";

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
  const { sheetExpanded } = useContext(GlobalSheetContext);

  if (!Reflect.has(game.playersToRoles, player)) {
    console.error(`player not found ${player}`);
    return null;
  }
  return (
    <SheetBody>
      <div
        className={classNames(
          "pointer-events-auto w-full flex-1 overflow-y-auto bg-[--color-background] px-2",
          // eslint-disable-next-line prettier/prettier
          { "hidden": !sheetExpanded },
        )}
      >
        <Body player={player} />
      </div>
      <Header player={player} />
    </SheetBody>
  );
}
