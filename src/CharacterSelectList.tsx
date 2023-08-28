import {
  Button,
  Checkbox,
  Flex,
  IconButton,
  TextField,
  Text,
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
  const [, , , setAvailableRoles] = useSetAvailableRoles("test-game");

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

  function TeamDistribution() {
    const charsSelected = scriptJson.characters.filter(
      (char) => state[char.name]
    );

    return (
      <Flex>
        <Text as="span" style={{ flex: 1 }} color="blue">
          Townsfolk:{"  "}
          {charsSelected.filter((char) => char.team === "Townsfolk").length}
        </Text>
        <Text as="span" style={{ flex: 1 }} color="teal">
          Outsiders:{"  "}
          {charsSelected.filter((char) => char.team === "Outsider").length}
        </Text>
        <Text as="span" style={{ flex: 1 }} color="crimson">
          Minions:{"  "}
          {charsSelected.filter((char) => char.team === "Minion").length}
        </Text>
        <Text as="span" style={{ flex: 1 }} color="tomato">
          Demons:{"  "}
          {charsSelected.filter((char) => char.team === "Demon").length}
        </Text>
      </Flex>
    );
  }

  //
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await setAvailableRoles(
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

        <TeamDistribution />

        <Button type="submit">BEGIN</Button>
      </Flex>
    </form>
  );
}

export default CharacterSelectList;
