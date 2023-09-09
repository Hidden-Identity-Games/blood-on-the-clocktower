import { Button, TextField } from "@radix-ui/themes";
import React from "react";
import { useAddPlayer } from "../store/useStore";
import { useDefiniteGame } from "../store/GameContext";
import { usePlayer } from "../store/secretKey";

function AddPlayer() {
  const { game } = useDefiniteGame();

  const [name, setName] = React.useState("");
  const [_, setPlayer] = usePlayer();
  const [error, isLoading, , addPlayer] = useAddPlayer();
  const parsedName = name.toLowerCase();

  const taken = !!game.playersToRoles[parsedName];
  const joinable = name && !taken;

  return (
    <>
      <label htmlFor="name-input">NAME:</label>
      <TextField.Input
        id="name-input"
        placeholder="Player name..."
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        onKeyDown={async (event) => {
          if (event.key === "Enter" && joinable) {
            await addPlayer(name.toLocaleLowerCase());
          }
        }}
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
        <>
          <Button
            disabled={!joinable}
            mt="2"
            onClick={async () => {
              await addPlayer(name);
            }}
          >
            Join
          </Button>
          {taken && (
            <>
              <div>Name already taken, is this you?</div>
              <Button onClick={() => setPlayer(parsedName)}>Yes</Button>
            </>
          )}
        </>
      )}
    </>
  );
}

export default AddPlayer;
