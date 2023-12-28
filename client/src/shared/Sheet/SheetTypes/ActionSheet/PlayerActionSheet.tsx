import {
  type CharacterActionQueueItem,
  getAbility,
  getCharacter,
} from "@hidden-identity/shared";

import { PlayerMessageFlow } from "../../../../GMRoute/GMShared/PlayerListComponents/PlayerMessage";
import { SubmitMessage } from "../../../../GMRoute/GMShared/PlayerListComponents/PlayerMessage/messageShared/SubmitMessage";
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
  const { game } = useDefiniteGame();
  const { role } = action;
  const ability = getAbility(role, game.time);

  return (
    <div className="flex">
      {ability?.playerMessage ? (
        <PlayerMessageFlow action={action} message={ability.playerMessage} />
      ) : (
        <div>
          {getCharacter(role).ability}{" "}
          <SubmitMessage action={action} message={[]} player={action.player} />
        </div>
      )}
    </div>
  );
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
