import { type PlayerReminder, type Role } from "@hidden-identity/shared";

import { RoleIcon } from "../RoleIcon";

interface ReminderIconProps {
  reminder: PlayerReminder;
  role: Role;
}
export function ReminderIcon({ reminder, role }: ReminderIconProps) {
  return (
    <div className="relative">
      <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 text-ellipsis text-base capitalize">
        {reminder.name}
      </div>
      {reminder.fromPlayer && (
        <RoleIcon className="h-[80px] w-[80px]" role={role} />
      )}
    </div>
  );
}
