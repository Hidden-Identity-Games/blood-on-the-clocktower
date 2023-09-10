import { Button, Dialog, DialogClose, Flex } from "@radix-ui/themes";

export function DestructiveButton({
  confirmationText,
  onClick,
  ...buttonProps
}: React.ComponentProps<typeof Button> & {
  confirmationText: React.ReactNode;
}) {
  return (
    <Dialog.Root>
      <Dialog.Content className="m-2">
        <Dialog.Title>Are you sure?</Dialog.Title>
        {confirmationText}
        <Flex gap="3" mt="4" justify="end">
          <DialogClose>
            <Button>Cancel</Button>
          </DialogClose>
          <DialogClose>
            <Button onClick={onClick}>Confirm</Button>
          </DialogClose>
        </Flex>
      </Dialog.Content>
      <Dialog.Trigger>
        <Button {...buttonProps} />
      </Dialog.Trigger>
    </Dialog.Root>
  );
}
