import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { Input } from "@design-system/components/ui/input";
import { type Character, type Role } from "@hidden-identity/shared";
import {
  CHARACTERS,
  type CharacterType,
  getCharacter,
} from "@hidden-identity/shared";
import {
  Checkbox,
  Flex,
  Heading,
  IconButton,
  Separator,
  Text,
  TextField,
} from "@radix-ui/themes";
import Fuse from "fuse.js";
import { Bot } from "lucide-react";
import React from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { FaQuestion } from "react-icons/fa6";

import { colorMap } from "../../shared/CharacterTypes";
import { DestructiveButton } from "../../shared/DestructiveButton";
import { MeaningfulIcon } from "../../shared/MeaningfulIcon";
import { RoleIcon, RoleName } from "../../shared/RoleIcon";
import { SetCount } from "../../shared/SetCount";
import {
  useGenerateRandomRoleSet,
  useSetPlayerEstimate,
  useSetRoleInGame,
} from "../../store/actions/gmActions";
import { useDefiniteGame } from "../../store/GameContext";
import { useSetScript } from "../../store/useStore";

export interface CharacterSelectState {
  selectedRoles: {
    set: (role: Role, count: number) => void;
    value: Record<Role, number>;
  };
  availableRoles: Role[];
}

// doing some wonky shit because we cannot elave the tab mounted when we switch.
// so if we don't hoist state we lose data when switching tabs.
export function useCharacterSelectState(): CharacterSelectState {
  const { game } = useDefiniteGame();
  const [, , , setRoles] = useSetRoleInGame();

  return {
    selectedRoles: {
      set: (role: Role, count: number) => void setRoles(role, count),
      value: game.setupRoleSet,
    },
    availableRoles: game.script.map(({ id }) => id),
  };
}

export function CharacterSelectList({
  state,
}: {
  state: CharacterSelectState;
}) {
  const { game } = useDefiniteGame();
  const { script } = game;

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
  const [, setPlayerEstimateLoading, , setPlayerEstimate] =
    useSetPlayerEstimate();
  const [, , , generateRandomRoles] = useGenerateRandomRoleSet();

  return (
    <Flex gap="1" direction="column" px="3" py="1">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Expected player count"
          className="h-12 flex-1"
          aria-label="Expected player count"
          disabled={setPlayerEstimateLoading}
          onBlur={(e) => void setPlayerEstimate(Number(e.target.value))}
          defaultValue={game.estimatedPlayerCount || undefined}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              void setPlayerEstimate(
                Number((e.target as HTMLInputElement).value),
              );
            }
          }}
          type="number"
        />
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button aria-label="Randomize">
              <Bot />
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header>Generate a base script</Dialog.Header>
            <Dialog.Description>
              <div className="py-1">
                This will generate a base role set of random characters.
              </div>
              <div>
                <strong>WARNING</strong> You will need to manually modify based
                on additional setup rules
              </div>
            </Dialog.Description>
            <Dialog.Footer>
              <Dialog.Close asChild>
                <Button onClick={() => void generateRandomRoles()}>
                  Generate starter role set
                </Button>
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </div>
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
                    {getCharacter(role).delusional ? (
                      <Flex ml={"-1"}>
                        <MeaningfulIcon
                          size="1"
                          header={<Text>Delusional</Text>}
                          explanation={
                            <Text>
                              This is a character that thinks they are a
                              different character. To play a game with this
                              character, instead just add the character the
                              player things they are. Then add a note once the
                              game starts.
                            </Text>
                          }
                        >
                          <FaQuestion />
                        </MeaningfulIcon>
                      </Flex>
                    ) : (
                      <Checkbox
                        id={role}
                        className="mr-1"
                        checked={state.selectedRoles.value[role] > 0}
                        onClick={() => {
                          state.selectedRoles.set(
                            role,
                            state.selectedRoles.value[role] ? 0 : 1,
                          );
                        }}
                      />
                    )}
                    <RoleIcon role={role} className="h-4" />
                    <span className="capitalize">{RoleName(role)}</span>
                  </Flex>
                </label>
                <Flex align="center" gap="3">
                  <RoleCount role={role} characterSelectState={state} />
                  <DestructiveButton
                    variant="ghost"
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={async () => {
                      await setScript(
                        script.filter((char) => char.id !== role),
                      );
                      state.selectedRoles.set(role, 0);
                    }}
                    confirmationText={`This will ENTIRELY remove the ${RoleName(
                      role,
                    )} from the script. If you're instead trying to deselect or change the quantity of the role, don't do it here.`}
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
  const { game } = useDefiniteGame();
  const { script } = game;

  const [, , , setScript] = useSetScript();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [results, setResults] = React.useState<Character[]>([]);
  const fuse = React.useMemo(
    () => new Fuse(CHARACTERS, { keys: ["name"] }),
    [],
  );

  return (
    <Dialog.Root
      onOpenChange={() => {
        setSearchTerm("");
        setResults([]);
      }}
    >
      <Flex
        gap="5"
        align="center"
        style={{ height: "2em" }}
        className="mb-[100px]"
      >
        <Dialog.Trigger asChild>
          <IconButton variant="soft" size="1">
            <AiOutlinePlus />
          </IconButton>
        </Dialog.Trigger>
        <label>Add a Role</label>
      </Flex>

      <Dialog.Content className="mx-3">
        <Dialog.Header>Role Search:</Dialog.Header>
        <Dialog.Description>
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
              <Dialog.Close key={role.id} asChild>
                <button
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={async () => {
                    if (!script.find((r) => r.id === role.id)) {
                      await setScript([...script, { id: role.id }]);
                    }
                    if (!characterSelectState.selectedRoles.value[role.id]) {
                      characterSelectState.selectedRoles.set(role.id, 1);
                    }
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
        </Dialog.Description>
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
        asChild
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
        <Dialog.Header>Number of players to get this Role</Dialog.Header>
        <Dialog.Description>
          <Text size="8">
            <Flex justify="center" align="center" gap="7">
              <SetCount count={roleCount} setCount={setRoleCount} />
            </Flex>
          </Text>
        </Dialog.Description>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button
              onClick={() =>
                characterSelectState.selectedRoles.set(role, roleCount)
              }
            >
              Confirm
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
