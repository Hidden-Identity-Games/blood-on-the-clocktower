import { getAllReminders } from "@hidden-identity/shared";
import { Button, Dialog } from "@radix-ui/themes";
import { useMemo } from "react";

import { DialogHeader } from "../../../../../shared/DialogHeader";
import {
  PlayerNameWithRoleIcon,
  RoleIcon,
} from "../../../../../shared/RoleIcon";
import { usePlayerReminder } from "../../../../../store/actions/gmPlayerActions";
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
  const relevantReminders = useMemo(
    () => game.reminders.filter(({ name }) => name === reminder),
    [game.reminders, reminder],
  );
  const playerHasReminder = (player: string) =>
    relevantReminders.find((reminder) => reminder.toPlayer === player);

  // don't change the ordering when statuses change
  const frozenPlayerList = useMemo(() => {
    return [...game.playerList].sort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <Dialog.Root>
        <Dialog.Trigger>
          <Button>Apply {reminder}</Button>
        </Dialog.Trigger>

        <Dialog.Content>
          <div className="flex flex-col gap-1">
            <DialogHeader>Applying {reminder}</DialogHeader>
            <Dialog.Close key="cancel">
              <Button
                className="capitalize"
                size="3"
                variant="soft"
                color="lime"
              >
                {"Done"}
              </Button>
            </Dialog.Close>
            {frozenPlayerList.map((toPlayer) => (
              <Button
                key={toPlayer}
                className="capitalize"
                size="3"
                color="violet"
                variant={playerHasReminder(toPlayer) ? "soft" : "outline"}
                onClick={() => {
                  void setHaseReminder({
                    name: reminder,
                    toPlayer,
                    fromPlayer,
                  });
                }}
              >
                <PlayerNameWithRoleIcon player={toPlayer} />
                {playerHasReminder(toPlayer) && (
                  <RoleIcon role={getAllReminders()[reminder].role} />
                )}
              </Button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
