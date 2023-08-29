import { Checkbox, Flex, Heading } from "@radix-ui/themes";
import GameData from "./assets/game_scripts.json";
import { Character } from "./types/script";
import React from "react";

interface ScriptSelectListProps {
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
}

function ScriptSelectList({ setCharacters }: ScriptSelectListProps) {
  const [selectedScripts, setSelectedScripts] = React.useState<
    Record<string, boolean>
  >({});

  React.useEffect(() => {
    setCharacters(
      GameData.scripts
        .filter((script) => selectedScripts[script.name])
        .reduce<Character[]>((acc, { characters }) => {
          acc = [...acc, ...characters];
          return acc;
        }, [])
    );
  }, [selectedScripts, setCharacters]);

  return (
    <Flex gap="2" direction="column">
      <Heading as="h3" align={"center"}>
        Scripts
      </Heading>
      {GameData.scripts.map(({ name }) => (
        <Flex gap="2" align={"center"} key={name}>
          <Checkbox
            id={name}
            checked={!!selectedScripts[name]}
            onClick={() => {
              setSelectedScripts((oldState) => ({
                ...oldState,
                [name]: !oldState[name],
              }));
            }}
          />
          <Flex gap="1" align={"center"} key={name} asChild>
            <label style={{ flex: 1 }} htmlFor={name}>
              {name}
            </label>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
}

export default ScriptSelectList;
