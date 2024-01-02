import { getReminder, type ReminderType } from "@hidden-identity/shared";
import classNames from "classnames";

import { RoleIcon } from "../RoleIcon";

interface ReminderIconProps {
  reminderName: string;
  useReminderTypeColor?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
export function ReminderIcon({
  reminderName,
  children,
  className,
  onClick,
  useReminderTypeColor = false,
}: ReminderIconProps) {
  const reminderData = getReminder(reminderName);
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      className={classNames(
        "relative rounded-full h-full aspect-square",
        useReminderTypeColor && getReminderColorByType(reminderData.type),
        className,
      )}
    >
      {children}
      <RoleIcon className="h-full w-full" role={reminderData.role} />
    </Tag>
  );
}

function getReminderColorByType(type: ReminderType) {
  switch (type) {
    case "drunk":
    case "poison":
      return "border-4 border-red-400";
    case "abilitySpent":
      return "border-4 border-red-400";
    case "protected":
      return "border-4 border-blue-400";
    default:
      return null;
  }
}
