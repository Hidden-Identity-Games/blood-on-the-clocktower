import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { type Role } from "@hidden-identity/shared";
import {
  allTravelers,
  getCharacter,
  getDefaultAlignment,
} from "@hidden-identity/shared";
import { Plus } from "lucide-react";
import { useMemo } from "react";

import { shadCnColorMap } from "../../../../shared/CharacterTypes";
import { CharacterName, RoleIcon, RoleText } from "../../../../shared/RoleIcon";
import { useDefiniteGame } from "../../../../store/GameContext";

interface RoleSelectProps {
  traveler?: boolean;
  currentRole: Role;
  onSelect: (nextrole: Role | null) => void;
  children?: React.ReactNode;
  removable: boolean;
}

export function RoleSelect({
  currentRole,
  onSelect,
  traveler,
  children,
  removable,
}: RoleSelectProps) {
  const { game } = useDefiniteGame();
  const { script } = game;
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
      <Dialog.Trigger asChild>
        <Button
          variant="select"
          className="w-full"
          color={shadCnColorMap[getCharacter(currentRole).team]}
        >
          {children || (
            <>
              <RoleIcon role={currentRole} />
              <RoleText role={currentRole}>
                {getCharacter(currentRole).name}
              </RoleText>
              {!!game.rolesToPlayers[currentRole]?.length && (
                <span className="ml-1 truncate capitalize">
                  - {(game.rolesToPlayers[currentRole] ?? []).join(",")}
                </span>
              )}
            </>
          )}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="flex flex-col gap-1">
        <Dialog.Header>Choose role</Dialog.Header>
        <Dialog.Close key="remove" asChild>
          {removable ? (
            <Button
              className="w-full capitalize"
              variant="secondary"
              onClick={() => onSelect(null)}
            >
              Remove
            </Button>
          ) : (
            <Button className="w-full capitalize" variant="secondary">
              Cancel
            </Button>
          )}
        </Dialog.Close>
        {roles.map((role) => (
          <Dialog.Close key={role} asChild>
            <Button
              className="w-full"
              color={shadCnColorMap[getCharacter(role).team]}
              variant={role === currentRole ? "select" : "outline"}
              onClick={() => currentRole !== role && onSelect(role)}
            >
              <CharacterName role={role} className="" />
              {!!game.rolesToPlayers[role]?.length && (
                <span className="ml-1 truncate capitalize">
                  - {(game.rolesToPlayers[role] ?? []).join(",")}
                </span>
              )}
            </Button>
          </Dialog.Close>
        ))}
      </Dialog.Content>
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
          <Button
            variant="ghost"
            className="aspect-square rounded-full p-0"
            onClick={() => {
              addRole();
            }}
          >
            <Plus className="text-green-500" />
          </Button>
        )}
      </div>
      {[...roles].map((current, index) => (
        <RoleSelect
          removable={!fixedSize}
          key={current}
          currentRole={current}
          onSelect={(newItem) => replaceRole(newItem, index)}
        />
      ))}
    </>
  );
}
