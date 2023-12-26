import { ProgressTimeButton } from "./ProgressTimeButton";

export interface DayRemindersProps {}
export function DayReminders(_props: DayRemindersProps) {
  return (
    <>
      <div>Day reminders</div>
      <ProgressTimeButton confirmationText="Are you sure you'd like to start the night?">
        Start Night
      </ProgressTimeButton>
    </>
  );
}
