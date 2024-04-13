import { Dialog } from "@design-system/components/ui/dialog";
import { Button, Flex, TextArea } from "@radix-ui/themes";
import React from "react";

import { PlayerNameWithRoleIcon } from "../../../shared/RoleIcon";
import { usePlayerNotes } from "../../../store/actions/gmPlayerActions";
import { useDefiniteGame } from "../../../store/GameContext";

interface PlayerNoteInputProps {
  player: string;
  children: React.ReactNode;
  note?: string;
}

export function PlayerNoteInput({ player, children }: PlayerNoteInputProps) {
  const { game } = useDefiniteGame();
  const [, playerNotesLoading, , setPlayerNote] = usePlayerNotes();
  const [newNote, setNewNote] = React.useState(game.playerNotes[player]);
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        setNewNote(game.playerNotes[player]);
        if (open) {
          inputRef.current?.focus?.();
        }
      }}
    >
      <Dialog.Trigger asChild disabled={playerNotesLoading}>
        {children}
      </Dialog.Trigger>

      {/* Place the dialog above virtual keyboard */}
      <Dialog.Content className="absolute bottom-[50%] top-[5%] m-2 min-h-[250px]">
        <Flex className="h-[100%] w-full" direction="column" gap="4">
          <Dialog.Header className="capitalize">
            <Flex justify="between">
              <label className="flex-1" htmlFor="note-input">
                <PlayerNameWithRoleIcon player={player}>
                  Notes:
                </PlayerNameWithRoleIcon>
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
          </Dialog.Header>
          <Flex className="w-full flex-1" direction="column" gap="4" asChild>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void setPlayerNote(player, newNote);
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
                className="flex-1 rounded-l"
                value={newNote}
                onChange={(event) => {
                  setNewNote(event.currentTarget.value);
                }}
              />

              <Dialog.Footer>
                <Dialog.Close asChild>
                  <Button type="reset" variant="surface">
                    Cancel
                  </Button>
                </Dialog.Close>

                <Dialog.Close asChild>
                  <Button type="submit">Submit</Button>
                </Dialog.Close>
              </Dialog.Footer>
            </form>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
