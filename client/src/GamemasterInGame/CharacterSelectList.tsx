import { useMemo, useState } from "react";
import { Character, CharacterType, CharacterTypes } from "../types/script";
import {
  Checkbox,
  Flex,
  IconButton,
  Select,
  TextField,
  Heading,
} from "@radix-ui/themes";
import React from "react";
import { colorMap } from "../shared/CharacterTypes";
import { RoleIcon, RoleName } from "../shared/RoleIcon";

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
    if (!newCharacterName) {
      return;
    }
    // Switch to a GUID
    const newId = newCharacterName;
    state.additionalCharacters.set((curr) => [
      ...curr,
      {
        id: newId,
        name: newCharacterName,
        team: newCharacterTeam,
      },
    ]);
    state.selectedRoles.set((selectedroles) => ({
      ...selectedroles,
      [newId]: true,
    }));
    setNewCharacterName("");
  }
  const charactersByType: Record<CharacterType, Character[]> = useMemo(() => {
    const allCharacters = [
      ...state.characters,
      ...state.additionalCharacters.value,
    ];
    return {
      Townsfolk: allCharacters.filter((c) => c.team === "Townsfolk"),
      Outsider: allCharacters.filter((c) => c.team === "Outsider"),
      Minion: allCharacters.filter((c) => c.team === "Minion"),
      Demon: allCharacters.filter((c) => c.team === "Demon"),
      Unknown: allCharacters.filter((c) => c.team === "Unknown"),
    };
  }, [state.characters, state.additionalCharacters.value]);

  return (
    <Flex gap="1" direction="column" px="3">
      {Object.entries(charactersByType)
        .filter(([_, characters]) => characters.length > 0)
        .map(([characterType, characters]) => (
          <React.Fragment key={characterType}>
            <Heading
              size="4"
              id={characterType}
              align="right"
              color={colorMap[characterType as CharacterType]}
            >
              {characterType}
            </Heading>
            {characters.map(({ id }) => (
              <Flex
                gap="1"
                align={"center"}
                key={id}
                style={{ height: "2em" }}
                asChild
              >
                <label>
                  <Checkbox
                    id={id}
                    checked={state.selectedRoles.value[id]}
                    onClick={() => {
                      state.selectedRoles.set((selectedroles) => ({
                        ...selectedroles,
                        [id]: !selectedroles[id],
                      }));
                    }}
                  />
                  <RoleIcon role={id} style={{ maxHeight: "3em" }} />
                  <span style={{ textTransform: "capitalize" }}>
                    {RoleName(id)}
                  </span>
                </label>
              </Flex>
            ))}
          </React.Fragment>
        ))}

      <Flex align={"center"} gap="2" pt="2" pb="6">
        <IconButton
          type="button"
          size="1"
          onClick={addNewCharacter}
          disabled={!newCharacterName}
        >
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
      {/* <div className="mobile-spacer" style={{ height: 150, width: "100%" }} /> */}
    </Flex>
  );
}
