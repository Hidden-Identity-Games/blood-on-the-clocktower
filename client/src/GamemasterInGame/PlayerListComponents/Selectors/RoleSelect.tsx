import { useMemo } from "react";
import { Role } from "@hidden-identity/shared";
import { Button, Dialog, Flex, Heading, IconButton } from "@radix-ui/themes";
import { useDefiniteGame } from "../../../store/GameContext";
import { CharacterName } from "../../../shared/RoleIcon";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  allTravelers,
  getCharacter,
  getDefaultAlignment,
} from "@hidden-identity/shared";
import { colorMap } from "../../../shared/CharacterTypes";

interface RoleSelectProps {
  traveler?: boolean;
  currentRole: Role;
  onSelect: (nextrole: Role | null) => void;
  children?: React.ReactNode;
}

export function RoleSelect({
  currentRole,
  onSelect,
  traveler,
  children,
}: RoleSelectProps) {
  const { script, game } = useDefiniteGame();
  const roles = useMemo(() => {
    return traveler
      ? allTravelers()
      : script
          .map(({ id }) => id)
          .sort((a, b) =>
            getDefaultAlignment(a) > getDefaultAlignment(b) ? -1 : 1,
          );
  }, [traveler, script]);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          variant="outline"
          size="3"
          className="w-full"
          color={colorMap[getCharacter(currentRole).team]}
        >
          {children || (
            <>
              <CharacterName role={currentRole} size="3" />
              {!!game.rolesToPlayers[currentRole]?.length && (
                <span className="-ml-1 truncate capitalize">
                  - {game.rolesToPlayers[currentRole].join(",")}
                </span>
              )}
            </>
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
              Remove
            </Button>
          </Dialog.Close>
          {roles.map((role) => (
            <Dialog.Close key={role}>
              <Button
                size="3"
                color={colorMap[getCharacter(role).team]}
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
  fixedSize?: boolean;
}

export function RoleSelectList({
  roles,
  addRole,
  replaceRole,
  fixedSize,
}: RoleSelectListProps) {
  return (
    <>
      <Heading className="flex items-center gap-1">
        Role{" "}
        {!fixedSize && (
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
        )}
      </Heading>
      {[...roles].map((current, index) => (
        <RoleSelect
          key={current}
          currentRole={current}
          onSelect={(newItem) => newItem && replaceRole(newItem, index)}
        />
      ))}
    </>
  );
}
