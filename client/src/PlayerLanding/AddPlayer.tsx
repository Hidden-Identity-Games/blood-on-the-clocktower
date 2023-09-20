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
import { useGame } from "../store/GameContext";
import { usePlayer } from "../store/secretKey";

function AddPlayer() {
  const { game } = useGame();

  const [name, setName] = React.useState("");
  const [_, setPlayer] = usePlayer();
  const [rejoinOpen, setRejoinOpen] = useState(false);
  const [error, isLoading, , addPlayer] = useAddPlayer();
  const parsedName = name.trim().toLowerCase();

  const taken = !!game?.playersToRoles[parsedName];

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <label htmlFor="name-input">NAME:</label>
          <TextField.Input
            autoFocus
            id="name-input"
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

        <Button mt="2" onClick={handleSubmit}>
          Join
        </Button>
      </Flex>
    </Flex>
  );
}

export default AddPlayer;
