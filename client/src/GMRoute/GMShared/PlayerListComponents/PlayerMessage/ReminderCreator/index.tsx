import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { getAllReminders } from "@hidden-identity/shared";
import { useMemo } from "react";

import {
  PlayerNameWithRoleIcon,
  RoleIcon,
} from "../../../../../shared/RoleIcon";
import {
  useClearPlayerReminder,
  usePlayerReminder,
} from "../../../../../store/actions/gmPlayerActions";
import { useDefiniteGame } from "../../../../../store/GameContext";

export interface ReminderCreatorProps {
  reminder: string;
  fromPlayer: string;
}
export function ReminderCreator({
  reminder,
  fromPlayer,
}: ReminderCreatorProps) {
  const { game } = useDefiniteGame();
  const [, , , setHaseReminder] = usePlayerReminder();
  const [, , , clearReminder] = useClearPlayerReminder();
  const relevantReminders = useMemo(
    () =>
      game.reminders.filter(({ name, active }) => active && name === reminder),
    [game, reminder],
  );
  const playerHasReminder = (player: string) =>
    relevantReminders.find((reminder) => reminder.toPlayer === player);

  // don't change the ordering when statuses change
  const frozenPlayerList = game.playerList;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Apply {reminder}</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Header>Applying {reminder}</Dialog.Header>
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
          <Dialog.Close key="cancel" asChild>
            <Button className="capitalize">{"Done"}</Button>
          </Dialog.Close>
          {frozenPlayerList.map((toPlayer) => (
            <Button
              key={toPlayer}
              className="grid h-auto grid-cols-5 text-lg capitalize"
              variant={playerHasReminder(toPlayer) ? "soft" : "outline"}
              onClick={() => {
                const currentReminder = playerHasReminder(toPlayer);
                if (!currentReminder) {
                  void setHaseReminder({
                    name: reminder,
                    toPlayer,
                    fromPlayer,
                  });
                } else {
                  void clearReminder(currentReminder.id);
                }
              }}
            >
              <PlayerNameWithRoleIcon
                player={toPlayer}
                className="col-span-3 col-start-2 justify-center text-center"
              />
              {playerHasReminder(toPlayer) && (
                <RoleIcon
                  role={getAllReminders()[reminder].role}
                  className="col-start-5 self-center justify-self-end"
                />
              )}
            </Button>
          ))}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
