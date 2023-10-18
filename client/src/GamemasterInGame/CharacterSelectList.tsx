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
import { useSetScript } from "../store/useStore";
import { useDefiniteGame } from "../store/GameContext";
import { DestructiveButton } from "./DestructiveButton";
import { AiOutlineClose } from "react-icons/ai";
import Fuse from "fuse.js";

interface StateContainer<T> {
  value: T;
  set: (newValue: T | ((prevState: T) => T)) => void;
}

export interface CharacterSelectState {
  selectedRoles: StateContainer<Record<Role, boolean>>;
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

  return {
    selectedRoles: {
      set: setSelectedRoles,
      value: selectedRoles,
    },
    characters,
  };
}

export function CharacterSelectList({
  state,
}: {
  state: CharacterSelectState;
}) {
  const { script } = useDefiniteGame();
  const [, , , setScript] = useSetScript();
  const charactersByType: Record<CharacterType, Role[]> = useMemo(() => {
    const allCharacters = state.characters;
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
  }, [state.characters]);

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
              <Flex key={role} align="center" justify="between">
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
                <DestructiveButton
                  variant="ghost"
                  onClick={async () => {
                    await setScript(script.filter((char) => char.id !== role));
                    state.selectedRoles.set((selectedRoles) => ({
                      ...selectedRoles,
                      [role]: false,
                    }));
                  }}
                  confirmationText={`Remove ${RoleName(role)} from script?`}
                >
                  <AiOutlineClose />
                </DestructiveButton>
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
  const { script } = useDefiniteGame();
  const [, , , setScript] = useSetScript();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [results, setResults] = React.useState<Character[]>([]);
  const fuse = React.useMemo(
    () => new Fuse(characters, { keys: ["name"] }),
    [],
  );

  return (
    <Dialog.Root
      onOpenChange={() => {
        setSearchTerm("");
        setResults([]);
      }}
    >
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
                onClick={async () => {
                  await setScript([...script, { id: role.id as Role }]);
                  characterSelectState.selectedRoles.set((selectedRoles) => ({
                    ...selectedRoles,
                    [role.id]: true,
                  }));
                }}
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
