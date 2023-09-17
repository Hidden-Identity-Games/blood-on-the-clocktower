import { Role } from "@hidden-identity/server";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { CharacterName } from "../../../shared/RoleIcon";
import { allTravelers } from "../../../assets/game_data/gameData";

interface TravelerSelectProps {
  currentRole: Role;
  onSelect: (nextrole: Role | null) => void;
}

export function TravelerSelect({ currentRole, onSelect }: TravelerSelectProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="outline" size="3" className="">
          <CharacterName role={currentRole} size="3" />
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
          {allTravelers().map((role) => (
            <Dialog.Close key={role}>
              <Button
                size="3"
                variant={role === currentRole ? "soft" : "outline"}
                onClick={() => onSelect(role)}
              >
                <CharacterName role={role} className="" />
              </Button>
            </Dialog.Close>
          ))}
        </Dialog.Content>
      </Flex>
    </Dialog.Root>
  );
}
