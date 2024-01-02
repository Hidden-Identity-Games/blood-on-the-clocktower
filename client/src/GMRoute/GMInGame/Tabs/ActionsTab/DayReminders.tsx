import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import {
  getAllReminders,
  getCharacter,
  type Role,
} from "@hidden-identity/shared";
import { ArrowRight } from "lucide-react";
import { type ReactNode } from "react";

import { RoleIcon } from "../../../../shared/RoleIcon";
import { useDefiniteGame } from "../../../../store/GameContext";
import { ProgressTimeButton } from "./ProgressTimeButton";

interface DayRemindersProps {}
export function DayReminders(_props: DayRemindersProps) {
  const { game } = useDefiniteGame();
  const allReminders = getAllReminders();
  const dayReminders = game.reminders
    .filter(({ name, active }) => active && allReminders[name].dayReminder)
    .map((reminder) => {
      return {
        ...reminder,
        appliesToSelf: reminder.fromPlayer === reminder.toPlayer,
      };
    });

  return (
    <>
      <div>Day Reminders</div>
      {dayReminders.map((reminder) => (
        <AbilityDialog
          role={game.playersToRoles[reminder.fromPlayer]}
          key={reminder.id}
        >
          <Button variant="soft" className="items-center capitalize">
            {!reminder.appliesToSelf && (
              <>
                <RoleIcon
                  className="h-[60px]"
                  role={game.playersToRoles[reminder.fromPlayer]}
                />
                <ArrowRight />
              </>
            )}
            <RoleIcon
              className="h-[60px]"
              role={game.playersToRoles[reminder.toPlayer]}
            />
            <span className="mx-8 text-xl">{reminder.name}</span>
          </Button>
        </AbilityDialog>
      ))}
      <ProgressTimeButton confirmationText="Are you sure you'd like to start the night?">
        Start Night
      </ProgressTimeButton>
    </>
  );
}

interface AbilityDialogProps {
  role: Role;
  children: ReactNode;
}
function AbilityDialog({ role, children }: AbilityDialogProps) {
  const abilityText = getCharacter(role).ability;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content>{abilityText}</Dialog.Content>
    </Dialog.Root>
  );
}
