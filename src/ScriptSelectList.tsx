import { Checkbox, Flex } from "@radix-ui/themes";
import GameData from "./assets/game_data/scripts.json";
import React from "react";

interface ScriptSelectListProps {
  handleChange: (a: Record<string, boolean>) => void;
}

function ScriptSelectList({ handleChange }: ScriptSelectListProps) {
  const [selectedScripts, setSelectedScripts] = React.useState<
    Record<string, boolean>
  >({});

  React.useEffect(
    () => handleChange(selectedScripts),
    [selectedScripts, handleChange],
  );

  return (
    <Flex gap="2" direction="column">
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
