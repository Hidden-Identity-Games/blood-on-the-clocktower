import {
  Button,
  Checkbox,
  Flex,
  IconButton,
  TextField,
} from "@radix-ui/themes";
import { Character } from "../types/script";
import React from "react";
import GameScripts from "../assets/game_data/scripts.json";
import CharacterRoles from "../assets/game_data/roles.json";
import TeamDistributionBar from "./TeamDistributionBar";

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
  const scriptRoles = GameScripts.scripts
    .filter(({ name }) => selectedScripts.includes(name))
    .map((script) => script.characters)
    .flat()
    .map(({ id }) => id);
  const characters = CharacterRoles.characters.filter(({ id }) =>
    scriptRoles.includes(id),
  );

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

  //
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        handleFormSubmit();
        throw new Error("I broke roles, reimplement");
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

        <TeamDistributionBar
          charsSelected={characters.filter(({ name }) => state[name])}
        />

        <Button type="submit">BEGIN</Button>
      </Flex>
    </form>
  );
}

export default CharacterSelectList;
