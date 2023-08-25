import { Button, TextField } from "@radix-ui/themes";
import React from "react";
import { useAddPlayer } from "./store/useStore";

interface AddPlayerProps {
  handleFormSubmit: (playerName: string) => void;
}

function AddPlayer({ handleFormSubmit }: AddPlayerProps) {
  const [name, setName] = React.useState("");
  const [error, isLoading, , addPlayer] = useAddPlayer("test-game");

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await addPlayer(name);
        handleFormSubmit(name);
      }}
    >
      <label htmlFor="name-input">NAME:</label>
      <TextField.Input
        id="name-input"
        placeholder="Player name..."
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      {error && (
        <div>
          {error.match(/taken/)
            ? "Try another name, cause someone took yours."
            : "There was an error, please try again."}
        </div>
      )}
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <Button type="submit" mt="2">
          Join
        </Button>
      )}
    </form>
  );
}

export default AddPlayer;
