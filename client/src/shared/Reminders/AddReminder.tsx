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
          {availableReminders.map(([role, reminder]) => (
            <Dialog.Close asChild>
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
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
