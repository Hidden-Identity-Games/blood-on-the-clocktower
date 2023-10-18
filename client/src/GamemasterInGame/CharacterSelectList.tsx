import { useMemo, useState } from "react";
import { CharacterType } from "../types/script";
import {
  Checkbox,
  Flex,
  IconButton,
  Text,
  TextField,
  Heading,
  Dialog,
  Separator,
} from "@radix-ui/themes";
import React from "react";
import { colorMap } from "../shared/CharacterTypes";
import { RoleIcon, RoleName } from "../shared/RoleIcon";
import { Character, Role } from "@hidden-identity/server";
import { getCharacter } from "../assets/game_data/gameData";
import { characters } from "../assets/game_data/characterData";
import Fuse from "fuse.js";

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
// eslint-disable-next-line react-refresh/only-export-components
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
  // function addNewCharacter() {
  //   if (!newCharacterName) {
  //     return;
  //   }
  //   // Switch to a GUID
  //   const newId = newCharacterName;
  //   state.additionalCharacters.set((curr) => [...curr, newId as Role]);
  //   state.selectedRoles.set((selectedroles) => ({
  //     ...selectedroles,
  //     [newId]: true,
  //   }));
  //   setNewCharacterName("");
  // }
  const charactersByType: Record<CharacterType, Role[]> = useMemo(() => {
    const allCharacters = [
      ...state.characters,
      ...state.additionalCharacters.value,
    ];
    return {
      Townsfolk: allCharacters.filter(
        (c) => getCharacter(c)?.team === "Townsfolk",
      ),
      Outsider: allCharacters.filter(
        (c) => getCharacter(c)?.team === "Outsider",
      ),
      Minion: allCharacters.filter((c) => getCharacter(c)?.team === "Minion"),
      Demon: allCharacters.filter((c) => getCharacter(c)?.team === "Demon"),
      Traveler: allCharacters.filter(
        (c) => getCharacter(c)?.team === "Traveler",
      ),
      Unknown: allCharacters.filter((c) => !getCharacter(c)),
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
                align="center"
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
                  <RoleIcon role={role} className="h-4" />
                  <span className="capitalize">{RoleName(role)}</span>
                </label>
              </Flex>
            ))}
          </React.Fragment>
        ))}
      <Separator size="4" />
      <AddRole characterSelectState={state} />
    </Flex>
  );
}

interface AddRoleProps {
  characterSelectState: CharacterSelectState;
}
function AddRole({ characterSelectState }: AddRoleProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [results, setResults] = React.useState<Character[]>([]);
  const fuse = React.useMemo(
    () => new Fuse(characters, { keys: ["name"] }),
    [],
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Flex gap="5" align="center" style={{ height: "2em" }}>
          <IconButton variant="soft" size="1">
            +
          </IconButton>
          <label>Add a Role</label>
        </Flex>
      </Dialog.Trigger>

      <Dialog.Content className="mx-3">
        <Dialog.Title>Role Search:</Dialog.Title>

        <Flex direction="column" gap="3">
          <TextField.Input
            placeholder="Find a role..."
            value={searchTerm}
            onChange={(e) => {
              const nextSearchTerm = e.currentTarget.value;
              setSearchTerm(nextSearchTerm);
              setResults(
                fuse
                  .search(nextSearchTerm)
                  .slice(0, 3)
                  .map(({ item }) => getCharacter(item.id as Role)),
              );
            }}
          />
          {results.map((role) => (
            <Dialog.Close key={role.id}>
              <button
                onClick={() =>
                  characterSelectState.additionalCharacters.set((curr) => [
                    ...curr,
                    role.id,
                  ])
                }
              >
                <Flex justify="between" align="center">
                  <Flex gap="2" align="center">
                    <RoleIcon role={role.id} className="h-[60px]" />
                    <Text size="5" autoCapitalize="true">
                      {RoleName(role.id)}
                    </Text>
                  </Flex>
                  <Text size="5" autoCapitalize="true">
                    {role.team}
                  </Text>
                </Flex>
              </button>
            </Dialog.Close>
          ))}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
