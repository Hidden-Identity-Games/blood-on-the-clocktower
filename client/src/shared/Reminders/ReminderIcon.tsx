import { getReminder, type ReminderType } from "@hidden-identity/shared";
import classNames from "classnames";

import { RoleIcon } from "../RoleIcon";

interface ReminderIconProps {
  reminderName: string;
  useReminderTypeColor?: boolean;
  children?: React.ReactNode;
  className?: string;
}
export function ReminderIcon({
  reminderName,
  children,
  className,
  useReminderTypeColor = false,
}: ReminderIconProps) {
  const reminderData = getReminder(reminderName);
  const typeColor = getReminderColorByType(reminderData.type);

  return (
    <div
      className={classNames(
        "relative rounded-full h-full aspect-square",
        useReminderTypeColor && typeColor,
        className,
      )}
    >
      {children}
      <RoleIcon className="h-full w-full" role={reminderData.role} />
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
