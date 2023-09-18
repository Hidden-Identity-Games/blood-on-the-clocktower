import React from "react";
import { useEditPlayerNotes } from "../../store/useStore";
import { Button, Dialog, Flex, TextArea } from "@radix-ui/themes";
import { PlayerNameWithRoleIcon } from "../../shared/RoleIcon";

interface PlayerNoteInputProps {
  player: string;
  children: React.ReactNode;
  note?: string;
  hideRole?: boolean;
}

export function PlayerNoteInput({
  player,
  children,
  note = "",
  hideRole = false,
}: PlayerNoteInputProps) {
  const [, playerNotesLoading, , setPlayerNote] = useEditPlayerNotes();
  const [newNote, setNewNote] = React.useState(note);
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);

  return (
    <Dialog.Root onOpenChange={() => setNewNote(note ? `${note}\n` : note)}>
      <Dialog.Trigger disabled={playerNotesLoading}>{children}</Dialog.Trigger>

      <Dialog.Content className="m-2">
        <Dialog.Title className="capitalize">
          <Flex justify="between">
            <label className="flex-1" htmlFor="note-input">
              {hideRole ? (
                `Notes: ${player}`
              ) : (
                <PlayerNameWithRoleIcon player={player}>
                  Notes:
                </PlayerNameWithRoleIcon>
              )}
            </label>
            <Button
              type="reset"
              variant="surface"
              onClick={() => {
                setNewNote("");
                inputRef.current?.focus();
              }}
            >
              Clear
            </Button>
          </Flex>
        </Dialog.Title>
        <Flex className="w-full" direction="column" gap="4" asChild>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setPlayerNote(player, newNote);
            }}
          >
            <TextArea
              autoFocus
              onFocus={(e) =>
                e.currentTarget.setSelectionRange(
                  e.currentTarget.value.length,
                  e.currentTarget.value.length,
                )
              }
              id="note-input"
              ref={inputRef}
              className=" h-[25vh] rounded-l"
              value={newNote}
              onChange={(event) => {
                setNewNote(event.currentTarget.value);
              }}
            />

            <Flex justify="between">
              <Dialog.Close>
                <Button type="reset" variant="surface">
                  Cancel
                </Button>
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
