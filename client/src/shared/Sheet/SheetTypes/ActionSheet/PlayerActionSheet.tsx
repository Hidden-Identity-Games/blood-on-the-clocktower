import { Button } from "@design-system/components/button";
import {
  type CharacterActionQueueItem,
  getAbility,
  getCharacter,
} from "@hidden-identity/shared";

import { PlayerMessageFlow } from "../../../../GMRoute/GMShared/PlayerListComponents/PlayerMessage";
import { ReminderCreator } from "../../../../GMRoute/GMShared/PlayerListComponents/PlayerMessage/ReminderCreator";
import { PlayerName } from "../../../../GMRoute/GMShared/PlayerListComponents/PlayerName";
import { useCompleteAction } from "../../../../store/actions/gmActions";
import { useDefiniteGame } from "../../../../store/GameContext";
import { useSheetExpanded } from "../../../../store/url";
import { ErrorCallout } from "../../../ErrorCallout";
import { PlayerNameWithRoleIcon, RoleIcon, RoleName } from "../../../RoleIcon";
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

interface CompleteActionButtonProps {
  actionId: string;
}
function CompleteActionButton({ actionId }: CompleteActionButtonProps) {
  const [error, loading, , completeAction] = useCompleteAction();
  const [_, setSheetExpanded] = useSheetExpanded();
  return (
    <>
      <ErrorCallout error={error} />
      <Button
        disabled={loading}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={async () => {
          await completeAction(actionId);
          setSheetExpanded(false);
        }}
      >
        Complete Action
      </Button>
    </>
  );
}

function Body({ action }: PlayerSheetProps) {
  const { game } = useDefiniteGame();
  const { role } = action;
  const ability = getAbility(role, game.time);

  return (
    <div className="flex flex-col gap-2 py-3 text-xl">
      <div className="items-center text-3xl font-semibold">
        <span className="flex items-center gap-1 pl-1">
          <PlayerName
            player={action.player}
            className="flex-initial shrink-0"
          />
          <RoleIcon role={role} />
          <span className=" text-lg">({RoleName(role)})</span>
        </span>
      </div>
      <div className="px-2">{getCharacter(role).ability}</div>

      {ability?.setReminders?.map((reminderName, index) => (
        <ReminderCreator
          key={`${reminderName}_${index}`}
          reminder={reminderName}
          fromPlayer={action.player}
        />
      ))}

      {ability?.playerMessage && (
        <PlayerMessageFlow action={action} message={ability.playerMessage} />
      )}
      <CompleteActionButton actionId={action.id} />
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
