import classNames from "classnames";

import { ErrorCallout } from "../../shared/ErrorCallout";
import { ReminderIcon } from "../../shared/Reminders/ReminderIcon";
import { useClearPlayerReminder } from "../../store/actions/gmPlayerActions";
import { useDefiniteGame } from "../../store/GameContext";

export interface StatusListProps {
  player: string;
  className?: string;
  clearOnClick?: boolean;
}
export function RemindersList({
  player,
  className,
  clearOnClick = false,
}: StatusListProps) {
  const [errorClearingReminder, , , clearReminder] = useClearPlayerReminder();

  const { game } = useDefiniteGame();
  const reminders = game.reminders.filter(
    ({ active, toPlayer }) => active && toPlayer === player,
  );

  return (
    <div className={classNames("flex gap-1", className)}>
      <ErrorCallout error={errorClearingReminder} />
      {reminders.map((reminder) => (
        <ReminderIcon
          onClick={clearOnClick ? () => clearReminder(reminder.id) : undefined}
          useReminderTypeColor
          reminderName={reminder.name}
          key={reminder.id}
        />
      ))}
    </div>
  );
}
