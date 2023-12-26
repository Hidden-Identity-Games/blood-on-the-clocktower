import { DestructiveButton } from "../../../../shared/DestructiveButton";
import { ErrorCallout } from "../../../../shared/ErrorCallout";
import { useProgressTime } from "../../../../store/actions/gmActions";

interface ProgressTimeButtonProps
  extends Omit<React.ComponentProps<typeof DestructiveButton>, "onClick"> {}
export function ProgressTimeButton(props: ProgressTimeButtonProps) {
  const [progressTimeError, progressTimeIsLoading, , progressTime] =
    useProgressTime();
  return (
    <>
      <ErrorCallout error={progressTimeError} />
      <DestructiveButton
        disabled={props.disabled || progressTimeIsLoading}
        onClick={() => void progressTime()}
        {...props}
      />
    </>
  );
}
