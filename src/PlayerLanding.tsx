import { Button, TextField } from "@radix-ui/themes";
import React from "react";

interface PlayerLandingProps {
  handleFormSubmit: (formData: string) => void;
}

function PlayerLanding({ handleFormSubmit }: PlayerLandingProps) {
  const [name, setName] = React.useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
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
      <Button type="submit" mt="2">
        Join
      </Button>
    </form>
  );
}

export default PlayerLanding;
