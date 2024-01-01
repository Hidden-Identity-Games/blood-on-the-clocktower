import { Button } from "@design-system/components/button";
import { type Role } from "@hidden-identity/shared";
import {
  allTravelers,
  getCharacter,
  getDefaultAlignment,
} from "@hidden-identity/shared";
import { PlusIcon } from "@radix-ui/react-icons";
import { Dialog, Flex, IconButton } from "@radix-ui/themes";
import { useMemo } from "react";

import { colorMap } from "../../../../shared/CharacterTypes";
import { CharacterName, RoleIcon, RoleText } from "../../../../shared/RoleIcon";
import { useDefiniteGame } from "../../../../store/GameContext";

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
          variant="select"
          className="w-full"
          color={colorMap[getCharacter(currentRole).team]}
        >
          {children || (
            <>
              <RoleIcon role={currentRole} />
              <RoleText role={currentRole}>
                {getCharacter(currentRole).name}
              </RoleText>
              {!!game.rolesToPlayers[currentRole]?.length && (
                <span className="ml-1 truncate capitalize">
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
              variant={currentRole === null ? "soft" : "outline"}
              onClick={() => onSelect(null)}
            >
              Remove
            </Button>
          </Dialog.Close>
          {roles.map((role) => (
            <Dialog.Close key={role}>
              <Button
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
      <div className="flex items-center gap-1">
        <h2 className="text-xl font-bold">Role{roles.length > 1 && "s"}</h2>{" "}
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
      </div>
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
