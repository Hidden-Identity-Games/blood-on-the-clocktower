import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";

export function DestructiveButton({
  confirmationText,
  onClick,
  ...buttonProps
}: React.ComponentProps<typeof Button> & {
  confirmationText: React.ReactNode;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button {...buttonProps} />
      </Dialog.Trigger>
      <Dialog.Content className="m-2">
        <Dialog.Header>Are you sure?</Dialog.Header>
        {confirmationText}
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="ghost">Cancel</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button onClick={onClick}>Confirm</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
