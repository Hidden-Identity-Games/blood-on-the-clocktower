import {
  Button,
  Checkbox,
  Flex,
  IconButton,
  TextField,
  Text,
} from "@radix-ui/themes";
import { Character } from "./types/script";
import React from "react";
import { useSetAvailableRoles } from "./store/useStore";
import GameData from "./assets/game_scripts.json";

interface CharacterSelectListProps {
  selectedScripts: string[];
  handleFormSubmit: () => void;
}

function CharacterSelectList({
  selectedScripts,
  handleFormSubmit,
}: CharacterSelectListProps) {
  const [state, setState] = React.useState<Record<string, boolean>>({});
  const [additionalCharacters, setAdditionalCharacters] = React.useState<
    Character[]
  >([]);
  const [newCharacterName, setNewCharacterName] = React.useState<string>("");
  const [, , , setAvailableRoles] = useSetAvailableRoles("test-game");
  const characters = GameData.scripts
    .filter((script) => selectedScripts.includes(script.name))
    .reduce<Character[]>((acc, { characters }) => {
      acc = [...acc, ...characters];
      return acc;
    }, []);

  //
  function addNewCharacter() {
    if (
      characters.map(({ name }) => name).includes(newCharacterName) ||
      !newCharacterName
    ) {
      return;
    }

    setAdditionalCharacters((oldCharacters) => [
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
    const charsSelected = GameData.scripts
      .reduce<Character[]>((acc, { characters }) => {
        acc = [...acc, ...characters];
        return acc;
      }, [])
      .filter(({ name }) => state[name]);

    function uniqueCharsByTeam(team: string) {
      return [
        ...new Set(
          charsSelected
            .filter((char) => char.team === team)
            .map(({ name }) => name)
        ),
      ].length;
    }

    return (
      <Flex>
        <Text as="span" style={{ flex: 1 }} color="blue">
          Townsfolk:{"  "}
          {uniqueCharsByTeam("Townsfolk")}
        </Text>
        <Text as="span" style={{ flex: 1 }} color="teal">
          Outsiders:{"  "}
          {uniqueCharsByTeam("Outsider")}
        </Text>
        <Text as="span" style={{ flex: 1 }} color="crimson">
          Minions:{"  "}
          {uniqueCharsByTeam("Minion")}
        </Text>
        <Text as="span" style={{ flex: 1 }} color="tomato">
          Demons:{"  "}
          {uniqueCharsByTeam("Demon")}
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
        {[...characters, ...additionalCharacters].map(({ name, imageSrc }) => (
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
