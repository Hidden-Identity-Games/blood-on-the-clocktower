import { Dialog, Grid } from "@radix-ui/themes";
import { type ReactNode } from "react";

import { usePlayerReminder } from "../store/actions/gmPlayerActions";
import { useAvailableReminders } from "../store/useStore";
import { DialogHeader } from "./DialogHeader";

interface AddPlayerReminderProps {
  children: ReactNode;
  player: string;
}
export function AddPlayerReminder({
  children,
  player,
}: AddPlayerReminderProps) {
  const availableReminders = useAvailableReminders();
  const [, isReminderLoading, , setReminder] = usePlayerReminder();

  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content>
        <DialogHeader>Available Reminders:</DialogHeader>
        <Grid columns="2">
          {availableReminders.map((reminder) => (
            <button
              key={reminder.name}
              disabled={isReminderLoading}
              onClick={() =>
                void setReminder({
                  ...reminder,
                  toPlayer: player,
                })
              }
            >
              {reminder.name}
            </button>
          ))}
        </Grid>
      </Dialog.Content>
    </Dialog.Root>
  );
}
