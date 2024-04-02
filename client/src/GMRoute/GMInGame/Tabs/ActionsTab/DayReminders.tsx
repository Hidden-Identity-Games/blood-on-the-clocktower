import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import {
  getAllReminders,
  getCharacter,
  type Reminder,
  type Role,
} from "@hidden-identity/shared";
import classNames from "classnames";
import { type ReactNode } from "react";

import { ReminderIcon } from "../../../../shared/Reminders/ReminderIcon";
import { PlayerNameWithRoleIcon } from "../../../../shared/RoleIcon";
import { useDefiniteGame } from "../../../../store/GameContext";
import { ProgressTimeButton } from "./ProgressTimeButton";

interface DayRemindersProps {}

const REMINDER_TYPES_TO_SHOW_IN_DAY: Reminder["type"][] = ["drunk", "poison"];
function showAsDayReminder(reminderName: Reminder["name"]) {
  const reminderWithData = getAllReminders()[reminderName];
  return (
    reminderWithData.dayReminder ||
    reminderWithData.dayTrigger ||
    REMINDER_TYPES_TO_SHOW_IN_DAY.includes(reminderWithData.type)
  );
}
export function DayReminders(_props: DayRemindersProps) {
  const { game } = useDefiniteGame();
  const dayReminders = game.reminders
    .filter(({ name, active }) => active && showAsDayReminder(name))
    .map((reminder) => {
      return {
        ...reminder,
        appliesToSelf: reminder.fromPlayer === reminder.toPlayer,
      };
    });
  const playersNotSenRoles = game.playerList.filter(
    (p) => !game.playersSeenRoles.includes(p),
  );

  return (
    <>
      <div>Day Reminders</div>
      {dayReminders.map((reminder) => {
        const reminderData = getAllReminders()[reminder.name];
        const roleFoReminder = reminderData.role;
        return (
          <AbilityDialog role={roleFoReminder} key={reminder.id}>
            <Button
              variant="soft"
              className={classNames(
                "items-center justify-between text-xl capitalize",
              )}
            >
              <div className="flex h-7 items-center">
                <div>Status: {reminder.name} </div>
                <ReminderIcon
                  reminderName={reminder.name}
                  useReminderTypeColor
                  className="ml-1"
                />
              </div>
              <div>
                <PlayerNameWithRoleIcon player={reminder.toPlayer} />
              </div>
            </Button>
          </AbilityDialog>
        );
      })}
      {playersNotSenRoles.map((p) => (
        <div>{p} has not seen role yet!</div>
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
