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
  Button,
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
import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Fuse from "fuse.js";

interface StateContainer<T> {
  value: T;
  set: (newValue: T | ((prevState: T) => T)) => void;
}

export interface CharacterSelectState {
  selectedRoles: StateContainer<Record<Role, number>>;
  availableRoles: Role[];
}

// doing some wonky shit because we cannot elave the tab mounted when we switch.
// so if we don't hoist state we lose data when switching tabs.
// eslint-disable-next-line react-refresh/only-export-components
export function useCharacterSelectState(
  availableRoles?: Role[],
): CharacterSelectState {
  const characters: Role[] = availableRoles ?? [];
  const [selectedRoles, setSelectedRoles] = React.useState<
    Record<Role, number>
  >({});

  return {
    selectedRoles: {
      set: setSelectedRoles,
      value: selectedRoles,
    },
    availableRoles: characters,
  };
}

export function CharacterSelectList({
  state,
}: {
  state: CharacterSelectState;
}) {
  const { script } = useDefiniteGame();
  const [, , , setScript] = useSetScript();
  const rolesByType: Record<CharacterType, Role[]> = React.useMemo(() => {
    return {
      Townsfolk: state.availableRoles.filter(
        (c) => getCharacter(c)?.team === "Townsfolk",
      ),
      Outsider: state.availableRoles.filter(
        (c) => getCharacter(c)?.team === "Outsider",
      ),
      Minion: state.availableRoles.filter(
        (c) => getCharacter(c)?.team === "Minion",
      ),
      Demon: state.availableRoles.filter(
        (c) => getCharacter(c)?.team === "Demon",
      ),
      Traveler: state.availableRoles.filter(
        (c) => getCharacter(c)?.team === "Traveler",
      ),
      Unknown: state.availableRoles.filter((c) => !getCharacter(c)),
    };
  }, [state.availableRoles]);

  return (
    <Flex gap="1" direction="column" px="3">
      {Object.entries(rolesByType)
        .filter(([_, roles]) => roles.length > 0)
        .map(([roleType, roles]) => (
          <React.Fragment key={roleType}>
            <Heading
              size="4"
              id={roleType}
              align="right"
              color={colorMap[roleType as CharacterType]}
            >
              {roleType}
            </Heading>
            {roles.map((role) => (
              <Flex key={role} align="center" justify="between">
                <label className="flex-1">
                  <Flex gap="1" align="center" style={{ height: "2em" }}>
                    <Checkbox
                      id={role}
                      className="mr-1"
                      checked={state.selectedRoles.value[role] > 0}
                      onClick={() => {
                        state.selectedRoles.set((selectedroles) => ({
                          ...selectedroles,
                          [role]: selectedroles[role] ? 0 : 1,
                        }));
                      }}
                    />
                    <RoleIcon role={role} className="h-4" />
                    <span className="capitalize">{RoleName(role)}</span>
                  </Flex>
                </label>
                <Flex align="center" gap="3">
                  <RoleCount role={role} characterSelectState={state} />
                  <DestructiveButton
                    variant="ghost"
                    onClick={async () => {
                      await setScript(
                        script.filter((char) => char.id !== role),
                      );
                      state.selectedRoles.set((selectedRoles) => ({
                        ...selectedRoles,
                        [role]: 0,
                      }));
                    }}
                    confirmationText={`Remove ${RoleName(role)} from script?`}
                  >
                    <AiOutlineClose />
                  </DestructiveButton>
                </Flex>
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
            <AiOutlinePlus />
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
                    [role.id]: 1,
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

interface RoleCountProps {
  role: Role;
  characterSelectState: CharacterSelectState;
}
function RoleCount({ role, characterSelectState }: RoleCountProps) {
  const [roleCount, setRoleCount] = React.useState(
    characterSelectState.selectedRoles.value[role],
  );
  return (
    <Dialog.Root
      onOpenChange={() =>
        setRoleCount(characterSelectState.selectedRoles.value[role])
      }
    >
      <Dialog.Trigger
        disabled={!characterSelectState.selectedRoles.value[role]}
      >
        <IconButton
          variant="surface"
          radius="large"
          className={
            characterSelectState.selectedRoles.value[role]
              ? "opacity-100"
              : "opacity-0"
          }
        >
          {characterSelectState.selectedRoles.value[role]}
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content className="mx-3">
        <Flex direction="column" gap="9">
          <Dialog.Title>Number of players to get this Role:</Dialog.Title>
          <Text size="8">
            <Flex justify="center" align="center" gap="7">
              <IconButton
                variant="soft"
                radius="full"
                size="3"
                onClick={() => setRoleCount((curr) => Math.max(curr - 1, 0))}
              >
                <AiOutlineMinus />
              </IconButton>
              <span>{roleCount}</span>
              <IconButton
                variant="soft"
                radius="full"
                size="3"
                onClick={() => setRoleCount((curr) => curr + 1)}
              >
                <AiOutlinePlus />
              </IconButton>
            </Flex>
          </Text>
          <Flex justify="between">
            <Dialog.Close>
              <Button variant="surface" size="3">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button
                size="3"
                onClick={() =>
                  characterSelectState.selectedRoles.set((selected) => ({
                    ...selected,
                    [role]: roleCount,
                  }))
                }
              >
                Confirm
              </Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
