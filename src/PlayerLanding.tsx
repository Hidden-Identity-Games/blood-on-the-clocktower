import { Button, TextField } from "@radix-ui/themes";
import { useAddPlayer } from "./store/useStore";
import React from "react";

interface PlayerLandingProps {
  handleFormSubmit: (playerName: string) => void;
}

function PlayerLanding({ handleFormSubmit }: PlayerLandingProps) {
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
            ? "Your name was taken, please add your last initial"
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

export default PlayerLanding;
