import { Role } from "@hidden-identity/server";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useDefiniteGame } from "../../../store/GameContext";
import { CharacterName } from "../../../shared/RoleIcon";

interface BaseRoleSelectProps {
  currentRole: Role;
}
type RoleSelectProps = BaseRoleSelectProps &
  (
    | {
        clearable: true;
        onSelect: (nextrole: Role | null) => void;
      }
    | {
        clearable?: false;
        onSelect: (nextrole: Role) => void;
      }
  );

export function RoleSelect({
  currentRole,
  onSelect,
  clearable,
}: RoleSelectProps) {
  const { script } = useDefiniteGame();
  const roles = script.map(({ id }) => id);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="outline" size="3" className="">
          <CharacterName role={currentRole} size="3" />
        </Button>
      </Dialog.Trigger>
      <Flex direction="column" gap="1" asChild>
        <Dialog.Content>
          {clearable && (
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
          )}
          {roles.map((role) => (
            <Dialog.Close key={role}>
              <Button
                size="3"
                variant={role === currentRole ? "soft" : "outline"}
                onClick={() => onSelect(role)}
              >
                <CharacterName role={role} />
              </Button>
            </Dialog.Close>
          ))}
        </Dialog.Content>
      </Flex>
    </Dialog.Root>
  );
}

interface BasePlayerSelectProps {
  currentPlayer: string;
}
type PlayerSelectProps = BasePlayerSelectProps &
  (
    | {
        clearable: true;
        onSelect: (nextrole: string | null) => void;
      }
    | {
        clearable?: false;
        onSelect: (nextrole: string) => void;
      }
  );

export function PlayerSelect({
  currentPlayer,
  onSelect,
  clearable,
}: PlayerSelectProps) {
  const { game } = useDefiniteGame();
  const playerList = [...game.playerList].sort();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="outline" size="3" className="capitalize">
          {currentPlayer}
        </Button>
      </Dialog.Trigger>
      <Flex direction="column" gap="1" asChild>
        <Dialog.Content>
          {clearable && (
            <Dialog.Close key="remove">
              <Button
                className="capitalize"
                size="3"
                variant={currentPlayer === null ? "soft" : "outline"}
                onClick={() => onSelect(null)}
              >
                {"Remove"}
              </Button>
            </Dialog.Close>
          )}
          {playerList.map((player) => (
            <Dialog.Close key={player}>
              <Button
                className="capitalize"
                size="3"
                variant={player === currentPlayer ? "soft" : "outline"}
                onClick={() => onSelect(player)}
              >
                {player}
              </Button>
            </Dialog.Close>
          ))}
        </Dialog.Content>
      </Flex>
    </Dialog.Root>
  );
}
