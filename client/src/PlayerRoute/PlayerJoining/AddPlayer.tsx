import {
  Button,
  Callout,
  Dialog,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import React, { useState } from "react";

import { useAddPlayer } from "../../store/actions/playerActions";
import { useDefiniteGame } from "../../store/GameContext";
import { useLastUsedName, usePlayer } from "../../store/usePlayer";

function AddPlayer() {
  const { game } = useDefiniteGame();

  const [_, setPlayer] = usePlayer();
  const [lastUsedName, setLastUsedName] = useLastUsedName();
  const [name, setName] = React.useState(lastUsedName ?? "");
  const [rejoinOpen, setRejoinOpen] = useState(false);
  const [error, isLoading, , addPlayer] = useAddPlayer();
  const parsedName = name.trim().toLowerCase();

  const taken = !!game.playersToRoles[parsedName];

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }

    if (taken) {
      setRejoinOpen(true);
    } else {
      setLastUsedName(parsedName);
      await addPlayer(parsedName);
    }
  };

  return (
    <Flex direction="column" gap="2" className="p-2">
      <Callout.Root color="violet">
        <Callout.Text>
          Welcome to a Hidden-Identity.Game! Your storyteller has invited you to
          play. Please enter the name your storyteller knows you best by, maybe
          with a last initial too.
        </Callout.Text>
      </Callout.Root>
      <Flex direction="column" gap="2" className="p-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
        >
          <label htmlFor="name-input">NAME:</label>
          <TextField.Input
            autoFocus
            id="name-input"
            className="capitalize"
            placeholder="Player name..."
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />
        </form>

        <Dialog.Root
          open={rejoinOpen}
          onOpenChange={() => setRejoinOpen(false)}
        >
          <Dialog.Content className="m-2">
            <Flex direction="column" gap="2">
              <Text as="div">
                That name already exists, have you already joined and would like
                to rejoin?
              </Text>
              <Dialog.Close>
                <Button>No, I will pick a new name</Button>
              </Dialog.Close>
              <Button
                onClick={() => {
                  setPlayer(parsedName);
                }}
              >
                Yes, that's me!
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
        {error && (
          <div>
            {error.match(/taken/)
              ? "Try another name, cause someone took yours."
              : "There was an error, please try again."}
          </div>
        )}

        <Button mt="2" onClick={() => void handleSubmit()}>
          Join
        </Button>
      </Flex>
    </Flex>
  );
}

export default AddPlayer;
