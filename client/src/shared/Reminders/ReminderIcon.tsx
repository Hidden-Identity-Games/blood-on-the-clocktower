import {
  getAllReminders,
  type PlayerReminder,
  type ReminderType,
  type Role,
} from "@hidden-identity/shared";
import classNames from "classnames";

import { RoleIcon } from "../RoleIcon";

interface ReminderIconProps {
  reminder: PlayerReminder;
  role: Role;
  useReminderTypeColor?: boolean;
}
export function ReminderIcon({
  reminder,
  role,
  useReminderTypeColor = false,
}: ReminderIconProps) {
  const reminderData = getAllReminders()[reminder.name];
  const typeColor = getReminderColorByType(reminderData.type);

  return (
    <div
      className={classNames(
        "relative rounded-full",
        useReminderTypeColor && typeColor,
      )}
    >
      <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 text-ellipsis text-base capitalize">
        {reminder.name}
      </div>
      {reminder.fromPlayer && (
        <RoleIcon className="h-[80px] w-[80px]" role={role} />
      )}
    </div>
  );
}

function getReminderColorByType(type: ReminderType) {
  switch (type) {
    case "drunk":
    case "poison":
    case "abilitySpent":
      return "bg-red-400";
    case "protected":
      return "bg-blue-400";
    default:
      return null;
  }
}
