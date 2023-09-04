import { useState } from "react";
import { Character, CharacterType, CharacterTypes } from "../types/script";
import DefaultRoleImageSrc from "../assets/default_role.svg";
import {
  Checkbox,
  Flex,
  IconButton,
  Select,
  TextField,
} from "@radix-ui/themes";

interface StateContainer<T> {
  value: T;
  set: (newValue: T | ((prevState: T) => T)) => void;
}

export interface CharacterSelectState {
  selectedRoles: StateContainer<Record<string, boolean>>;
  additionalCharacters: StateContainer<Character[]>;
  characters: Character[];
}

// doing some wonky shit because we cannot elave the tab mounted when we switch.
// so if we don't hoist state we lose data when switching tabs.
export function useCharacterSelectState(
  availableCharacters?: Character[],
): CharacterSelectState {
  const characters: Character[] = availableCharacters ?? [];
  const [selectedRoles, setSelectedRoles] = useState<Record<string, boolean>>(
    {},
  );
  const [additionalCharacters, setAdditionalCharacters] = useState<Character[]>(
    [],
  );

  return {
    selectedRoles: {
      set: setSelectedRoles,
      value: selectedRoles,
    },
    additionalCharacters: {
      set: setAdditionalCharacters,
      value: additionalCharacters,
    },
    characters,
  };
}

export function CharacterSelectList({
  state,
}: {
  state: CharacterSelectState;
}) {
  const [newCharacterName, setNewCharacterName] = useState("");
  const [newCharacterTeam, setNewCharacterTeam] =
    useState<CharacterType>("Townsfolk");

  function addNewCharacter() {
    if (
      state.additionalCharacters.value.find(({ id }) => id === newCharacterName)
    ) {
      return;
    }

    state.additionalCharacters.set((curr) => [
      ...curr,
      {
        id: newCharacterName,
        name: newCharacterName,
        team: newCharacterTeam,
      },
    ]);
    state.selectedRoles.set((selectedroles) => ({
      ...selectedroles,
      [newCharacterName]: true,
    }));
    setNewCharacterName("");
  }

  return (
    <Flex gap="2" direction="column">
      {[...state.characters, ...state.additionalCharacters.value].map(
        ({ name, imageSrc }) => (
          <Flex gap="2" align={"center"} key={name}>
            <Checkbox
              id={name}
              checked={state.selectedRoles.value[name]}
              onClick={() => {
                state.selectedRoles.set((selectedroles) => ({
                  ...selectedroles,
                  [name]: !selectedroles[name],
                }));
              }}
            />
            <Flex gap="1" align={"center"} key={name} asChild>
              <label style={{ flex: 1 }} htmlFor={name}>
                <img
                  src={imageSrc ?? DefaultRoleImageSrc}
                  height={"70px"}
                  width={"70px"}
                />
                {name}
              </label>
            </Flex>
          </Flex>
        ),
      )}

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
        <Select.Root
          onValueChange={(value) => setNewCharacterTeam(value as CharacterType)}
          defaultValue={newCharacterTeam}
        >
          <Select.Trigger variant="soft" color="gray" />
          <Select.Content>
            {CharacterTypes.map((type) => (
              <Select.Item key={type} value={type}>
                {type}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>
    </Flex>
  );
}
