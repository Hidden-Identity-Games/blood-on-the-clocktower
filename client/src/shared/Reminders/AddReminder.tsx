import { Dialog, Grid } from "@radix-ui/themes";
import { type ReactNode } from "react";

import { usePlayerReminder } from "../../store/actions/gmPlayerActions";
import { useAvailableReminders } from "../../store/useStore";
import { DialogHeader } from "../DialogHeader";
import { ReminderIcon } from "./ReminderIcon";

interface AddReminderProps {
  children: ReactNode;
  player: string;
}
export function AddReminder({ children, player }: AddReminderProps) {
  const availableReminders = useAvailableReminders();
  const [, isReminderLoading, , setReminder] = usePlayerReminder();

  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content>
        <DialogHeader>Available Reminders:</DialogHeader>
        <Grid columns="3">
          {availableReminders.map(([role, reminder]) => (
            <Dialog.Close>
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
                <ReminderIcon reminder={reminder} role={role} />
              </button>
            </Dialog.Close>
          ))}
        </Grid>
      </Dialog.Content>
    </Dialog.Root>
  );
}
