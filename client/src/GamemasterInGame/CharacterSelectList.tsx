import { useMemo, useState } from "react";
import { CharacterType, CharacterTypes } from "../types/script";
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
import { Role } from "@hidden-identity/server";
import { getRole } from "../assets/game_data/gameData";

interface StateContainer<T> {
  value: T;
  set: (newValue: T | ((prevState: T) => T)) => void;
}

export interface CharacterSelectState {
  selectedRoles: StateContainer<Record<Role, boolean>>;
  additionalCharacters: StateContainer<Role[]>;
  characters: Role[];
}

// doing some wonky shit because we cannot elave the tab mounted when we switch.
// so if we don't hoist state we lose data when switching tabs.
export function useCharacterSelectState(
  availableCharacters?: Role[],
): CharacterSelectState {
  const characters: Role[] = availableCharacters ?? [];
  const [selectedRoles, setSelectedRoles] = useState<Record<Role, boolean>>({});
  const [additionalCharacters, setAdditionalCharacters] = useState<Role[]>([]);

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
  readOnly,
}: {
  state: CharacterSelectState;
  readOnly: boolean;
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
    state.additionalCharacters.set((curr) => [...curr, newId as Role]);
    state.selectedRoles.set((selectedroles) => ({
      ...selectedroles,
      [newId]: true,
    }));
    setNewCharacterName("");
  }
  const charactersByType: Record<CharacterType, Role[]> = useMemo(() => {
    const allCharacters = [
      ...state.characters,
      ...state.additionalCharacters.value,
    ];
    return {
      Townsfolk: allCharacters.filter((c) => getRole(c).team === "Townsfolk"),
      Outsider: allCharacters.filter((c) => getRole(c).team === "Outsider"),
      Minion: allCharacters.filter((c) => getRole(c).team === "Minion"),
      Demon: allCharacters.filter((c) => getRole(c).team === "Demon"),
      Unknown: allCharacters.filter((c) => getRole(c).team === "Unknown"),
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
            {characters.map((role) => (
              <Flex
                gap="1"
                align={"center"}
                key={role}
                style={{ height: "2em" }}
                asChild
              >
                <label>
                  <Checkbox
                    id={role}
                    disabled={readOnly}
                    checked={state.selectedRoles.value[role]}
                    onClick={() => {
                      state.selectedRoles.set((selectedroles) => ({
                        ...selectedroles,
                        [role]: !selectedroles[role],
                      }));
                    }}
                  />
                  <RoleIcon
                    role={role}
                    style={{ height: "3em", aspectRatio: 1 }}
                  />
                  <span className="capitalize">{RoleName(role)}</span>
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
