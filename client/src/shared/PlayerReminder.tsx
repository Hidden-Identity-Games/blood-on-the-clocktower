import { Dialog, Grid } from "@radix-ui/themes";
import { type ReactNode } from "react";

import { useAvailableReminders } from "../store/useStore";
import { DialogHeader } from "./DialogHeader";

interface AddPlayerReminderProps {
  children: ReactNode;
  player: string;
}
export function AddPlayerReminder({
  children, // player,
}: AddPlayerReminderProps) {
  const availableReminders = useAvailableReminders();

  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content>
        <DialogHeader>Available Reminders:</DialogHeader>
        <Grid>
          {availableReminders.map((reminder) => (
            <button key={reminder.reminderText}>{reminder.reminderText}</button>
          ))}
        </Grid>
      </Dialog.Content>
    </Dialog.Root>
  );
}
