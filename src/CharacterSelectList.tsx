import { Button, Checkbox, Flex, Text } from "@radix-ui/themes";
import { Script } from "./types/script";
import React from "react";

interface CharacterSelectListProps {
  scriptJson: Script;
  handleFormSubmit: (formData: Record<string, boolean>) => void;
}

function CharacterSelectList({
  scriptJson,
  handleFormSubmit,
}: CharacterSelectListProps) {
  const [state, setState] = React.useState<Record<string, boolean>>({});

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleFormSubmit(state);
      }}
    >
      <Flex gap="2" direction="column">
        {scriptJson.characters.map(({ name }) => (
          <Flex gap="2" align={"center"} key={name}>
            <Checkbox
              id={name}
              checked={!!state[name]}
              onClick={() => {
                setState((oldState) => ({
                  ...oldState,
                  [name]: !oldState[name],
                }));
              }}
            />
            <label style={{ flex: 1 }} htmlFor={name}>
              {name}
            </label>
          </Flex>
        ))}

        <Button type="submit">Submit</Button>
      </Flex>
    </form>
  );
}

export default CharacterSelectList;
