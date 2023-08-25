import { Button, TextField } from "@radix-ui/themes";
import { useAddPlayer, useSelf } from "./store/useStore";
import React from "react";
import PlayerRole from "./PlayerRole";

interface PlayerLandingProps {
  handleFormSubmit: (playerName: string) => void;
}

function PlayerLanding({ handleFormSubmit }: PlayerLandingProps) {
  const self = useSelf("test-game");

  if (!self) return <div>Loading...</div>;

  if (!self.name) return <AddPlayer handleFormSubmit={handleFormSubmit} />;

  return <PlayerRole self={self} />;
}

function AddPlayer({ handleFormSubmit }: PlayerLandingProps) {
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

export default PlayerLanding;
