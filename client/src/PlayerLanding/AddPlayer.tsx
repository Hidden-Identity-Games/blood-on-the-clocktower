import {
  Button,
  Callout,
  Dialog,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import React, { useState } from "react";
import { useAddPlayer } from "../store/useStore";
import { useDefiniteGame } from "../store/GameContext";
import { usePlayer } from "../store/secretKey";

function AddPlayer() {
  const { game } = useDefiniteGame();

  const [name, setName] = React.useState("");
  const [_, setPlayer] = usePlayer();
  const [rejoinOpen, setRejoinOpen] = useState(false);
  const [error, isLoading, , addPlayer] = useAddPlayer();
  const parsedName = name.toLowerCase();

  const taken = !!game.playersToRoles[parsedName];

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }

    if (taken) {
      setRejoinOpen(true);
    } else {
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
        <label htmlFor="name-input">NAME:</label>
        <TextField.Input
          id="name-input"
          placeholder="Player name..."
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          onKeyDown={async (event) => {
            if (event.key === "Enter") {
              handleSubmit();
              // Otherwise it will also select in the dialog
              event.stopPropagation();
              event.preventDefault();
            }
          }}
        />
        <Dialog.Root
          open={rejoinOpen}
          onOpenChange={() => setRejoinOpen(false)}
        >
          <Dialog.Content>
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

        <Button mt="2" onClick={handleSubmit}>
          Join
        </Button>
      </Flex>
    </Flex>
  );
}

export default AddPlayer;
