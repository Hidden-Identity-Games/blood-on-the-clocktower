import { Role } from "@hidden-identity/server";
import { Button, Dialog, Flex, Heading, IconButton } from "@radix-ui/themes";
import { useDefiniteGame } from "../../../store/GameContext";
import { CharacterName } from "../../../shared/RoleIcon";
import { PlusIcon } from "@radix-ui/react-icons";

interface RoleSelectProps {
  currentRole: Role;
  onSelect: (nextrole: Role | null) => void;
}

export function RoleSelect({ currentRole, onSelect }: RoleSelectProps) {
  const { script, game } = useDefiniteGame();
  const roles = script.map(({ id }) => id);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="outline" size="3" className="w-full">
          <CharacterName role={currentRole} size="3" />
          {!!game.rolesToPlayers[currentRole]?.length && (
            <span className="-ml-1 truncate capitalize">
              - {game.rolesToPlayers[currentRole].join(",")}
            </span>
          )}
        </Button>
      </Dialog.Trigger>
      <Flex direction="column" gap="1" asChild>
        <Dialog.Content>
          <Dialog.Close key="remove">
            <Button
              className="capitalize"
              size="3"
              variant={currentRole === null ? "soft" : "outline"}
              onClick={() => onSelect(null)}
            >
              Clear
            </Button>
          </Dialog.Close>
          {roles.map((role) => (
            <Dialog.Close key={role}>
              <Button
                size="3"
                variant={role === currentRole ? "soft" : "outline"}
                onClick={() => currentRole !== role && onSelect(role)}
              >
                <CharacterName role={role} className="" />
                {!!game.rolesToPlayers[role]?.length && (
                  <span className="-ml-1 truncate capitalize">
                    - {game.rolesToPlayers[role].join(",")}
                  </span>
                )}
              </Button>
            </Dialog.Close>
          ))}
        </Dialog.Content>
      </Flex>
    </Dialog.Root>
  );
}

interface RoleSelectListProps {
  addRole: () => void;
  replaceRole: (replaceValue: Role | null, index: number) => void;
  roles: Role[];
}

export function RoleSelectList({
  roles,
  addRole,
  replaceRole,
}: RoleSelectListProps) {
  return (
    <>
      <Heading className="flex items-center gap-1">
        Role{" "}
        <IconButton
          variant="ghost"
          radius="full"
          className="pt-1"
          onClick={() => {
            addRole();
          }}
        >
          <PlusIcon />
        </IconButton>
      </Heading>
      {[...roles].map((current, index) => (
        <RoleSelect
          key={current}
          currentRole={current}
          onSelect={(newItem) => replaceRole(newItem, index)}
        />
      ))}
    </>
  );
}
