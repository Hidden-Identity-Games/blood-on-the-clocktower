import React from "react";
import { usePlayerNotes } from "../../store/useStore";
import {
  Button,
  Dialog,
  Flex,
  IconButton,
  TextFieldInput,
} from "@radix-ui/themes";
import { Cross1Icon } from "@radix-ui/react-icons";

interface PlayerNoteInputProps {
  player: string;
  children: React.ReactNode;
  id: string;
}

export function PlayerNoteInput({
  player,
  children,
  id,
}: PlayerNoteInputProps) {
  const [, playerNotesLoading, , setPlayerNote] = usePlayerNotes();
  const [note, setNote] = React.useState(id);

  return (
    <Dialog.Root onOpenChange={(e) => (e ? setNote(id) : setNote(""))}>
      <Dialog.Trigger disabled={playerNotesLoading}>{children}</Dialog.Trigger>

      <Dialog.Content className="m-2">
        <Dialog.Title className="capitalize">{player}: Add Note</Dialog.Title>
        <Flex className="w-full" direction="column" gap="4" asChild>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setPlayerNote(player, "add", {
                message: note,
                id: id,
              });
            }}
          >
            <Flex className="w-full" gap="2" align="center">
              <Dialog.Close>
                <IconButton size="1" variant="surface" radius="full">
                  <Cross1Icon />
                </IconButton>
              </Dialog.Close>
              <TextFieldInput
                value={note}
                onChange={(event) => setNote(event.currentTarget.value)}
              />
            </Flex>
            <Flex justify="between">
              <Dialog.Close>
                <Button type="reset">Cancel</Button>
              </Dialog.Close>

              <Dialog.Close>
                <Button type="submit">Add</Button>
              </Dialog.Close>
            </Flex>
          </form>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
