import { Dialog } from "@design-system/components/ui/dialog";
import { Switch } from "@design-system/components/ui/switch";
import { type ReactNode } from "react";

import { usePlayerReminder } from "../../store/actions/gmPlayerActions";
import { useAvailableReminders } from "../../store/useStore";
import { ReminderIcon } from "./ReminderIcon";

interface AddReminderProps {
  children: ReactNode;
  player: string;
}
export function AddReminder({ children, player }: AddReminderProps) {
  const [availableReminders, allReminders, setAllReminders] =
    useAvailableReminders();
  const [, isReminderLoading, , setReminder] = usePlayerReminder();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header className="flex flex-row items-center justify-between">
          <span>{allReminders ? "All" : "Available"} Reminders</span>
          <Switch
            checked={allReminders}
            onCheckedChange={(checked) => setAllReminders(checked)}
          />
        </Dialog.Header>
        <div className="columns-4">
          {availableReminders.map((reminder) => (
            <Dialog.Close asChild>
              <button
                key={reminder.name}
                className="w-full p-3"
                disabled={isReminderLoading}
                onClick={() =>
                  void setReminder({
                    ...reminder,
                    toPlayer: player,
                  })
                }
              >
                <ReminderIcon
                  useReminderTypeColor
                  reminderName={reminder.name}
                  className="bg-primary/50"
                >
                  <div className="absolute inset-0 flex flex-col justify-end text-base capitalize">
                    <div className="rounded-md bg-accent/40">
                      {reminder.name}
                    </div>
                  </div>
                </ReminderIcon>
              </button>
            </Dialog.Close>
          ))}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
