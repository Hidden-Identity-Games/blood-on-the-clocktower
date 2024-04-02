import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { getAllReminders } from "@hidden-identity/shared";
import { useMemo } from "react";

import { ReminderIcon } from "../../../../../shared/Reminders/ReminderIcon";
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
  const playersWithReminder = (reminderName: string) => [
    ...new Set(
      game.reminders
        .filter(({ active, name }) => reminderName === name && !!active)
        .map(({ toPlayer }) => toPlayer),
    ),
  ];

  // don't change the ordering when statuses change
  const frozenPlayerList = game.playerList;

  return (
    <Dialog.Root>
      <div className="flex h-8 items-center truncate capitalize">
        <ReminderIcon
          reminderName={reminder}
          className="mr-1 inline-block"
          useReminderTypeColor
        />
        {playersWithReminder(reminder).join(", ") || (
          <span className="text-gray-400"> - </span>
        )}
      </div>
      <Dialog.Trigger asChild>
        <Button variant="select">Apply {reminder}</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Header className="flex h-8 flex-row items-center justify-center capitalize">
          <div>Toggle {reminder}</div>

          <ReminderIcon className="h-[150%] pb-2" reminderName={reminder} />
        </Dialog.Header>
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
