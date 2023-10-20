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
        <Flex mt="5" justify="between">
          <DialogClose>
            <Button variant="surface" size="3">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose>
            <Button size="3" onClick={onClick}>
              Confirm
            </Button>
          </DialogClose>
        </Flex>
      </Dialog.Content>
      <Dialog.Trigger>
        <Button {...buttonProps} />
      </Dialog.Trigger>
    </Dialog.Root>
  );
}
