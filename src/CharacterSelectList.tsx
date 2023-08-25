import {
  Button,
  Checkbox,
  Flex,
  IconButton,
  TextField,
} from "@radix-ui/themes";
import { Character, Script } from "./types/script";
import React from "react";
import { useSetAvailableRoles } from "./store/useStore";

interface CharacterSelectListProps {
  scriptJson: Script;
  handleFormSubmit: () => void;
}

function CharacterSelectList({
  scriptJson,
  handleFormSubmit,
}: CharacterSelectListProps) {
  const [state, setState] = React.useState<Record<string, boolean>>({});
  const [characters, setCharacters] = React.useState<Character[]>(
    scriptJson.characters
  );
  const [newCharacterName, setNewCharacterName] = React.useState<string>("");
  const [error, isLoading, , setRoles] = useSetAvailableRoles("test-game");

  //
  function addNewCharacter() {
    if (
      characters.map(({ name }) => name).includes(newCharacterName) ||
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
      onSubmit={async (event) => {
        event.preventDefault();
        await setRoles(
          Object.entries(state)
            .filter(([, active]) => active)
            .map(([name]) => name)
        );
        handleFormSubmit();
      }}
    >
      <Flex gap="2" direction="column">
        {characters.map(({ name, imageSrc }) => (
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
            <Flex gap="1" align={"center"} key={name} asChild>
              <label style={{ flex: 1 }} htmlFor={name}>
                <img
                  src={imageSrc ?? "./src/assets/default_role.svg"}
                  height={"70px"}
                  width={"70px"}
                />
                {name}
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
