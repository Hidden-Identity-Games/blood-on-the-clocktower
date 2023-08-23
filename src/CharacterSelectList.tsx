import {
  Button,
  Checkbox,
  Flex,
  IconButton,
  TextField,
} from "@radix-ui/themes";
import { Character, Script } from "./types/script";
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
  const [characters, setCharacters] = React.useState<Character[]>(
    scriptJson.characters,
  );
  const [newCharacterName, setNewCharacterName] = React.useState<string>("");

  //
  function addNewCharacter() {
    if (
      characters.map((char) => char.name).includes(newCharacterName) ||
      !newCharacterName
    ) {
      return;
    }

    setCharacters((oldCharacters) => [
      ...oldCharacters,
      { name: newCharacterName } as Character,
    ]);

    setState((oldState) => ({
      ...oldState,
      [newCharacterName]: true,
    }));

    setNewCharacterName("");
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleFormSubmit(state);
      }}
    >
      <Flex gap="2" direction="column">
        {characters.map((char) => (
          <Flex gap="2" align={"center"} key={char.name}>
            <Checkbox
              id={char.name}
              checked={!!state[char.name]}
              onClick={() => {
                setState((oldState) => ({
                  ...oldState,
                  [char.name]: !oldState[char.name],
                }));
              }}
            />
            <Flex gap="1" align={"center"} key={char.name} asChild>
              <label style={{ flex: 1 }} htmlFor={char.name}>
                {char.imageSrc && (
                  <img src={char.imageSrc} height={"70px"} width={"70px"} />
                )}
                {char.name}
              </label>
            </Flex>
          </Flex>
        ))}

        <Flex align={"center"} gap="2">
          <IconButton type="button" size="1" onClick={addNewCharacter}>
            +
          </IconButton>
          <TextField.Input
            placeholder="Additional role"
            value={newCharacterName}
            onChange={(event) => setNewCharacterName(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addNewCharacter();
              }
            }}
          />
        </Flex>

        <Button type="submit">Submit</Button>
      </Flex>
    </form>
  );
}

export default CharacterSelectList;
