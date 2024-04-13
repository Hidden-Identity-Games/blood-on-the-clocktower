import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { Textarea } from "@design-system/components/ui/textarea";
import { Flex } from "@radix-ui/themes";
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
      <Dialog.Content>
        <Flex className="h-[100%] w-full" direction="column" gap="4">
          <Dialog.Header className="flex flex-row items-center justify-between gap-1 capitalize">
            <label className="flex-1 items-center" htmlFor="note-input">
              <PlayerNameWithRoleIcon player={player}>
                <span className="pr-1">Notes:</span>
              </PlayerNameWithRoleIcon>
            </label>
            <Button
              type="reset"
              variant="secondary"
              onClick={() => {
                setNewNote("");
                inputRef.current?.focus();
              }}
            >
              Clear
            </Button>
          </Dialog.Header>
          <Dialog.Description className="flex flex-col gap-4">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void setPlayerNote(player, newNote);
              }}
            >
              <Textarea
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
            </form>
          </Dialog.Description>
          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button type="reset" variant="secondary">
                Cancel
              </Button>
            </Dialog.Close>

            <Dialog.Close asChild>
              <Button type="submit">Submit</Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
