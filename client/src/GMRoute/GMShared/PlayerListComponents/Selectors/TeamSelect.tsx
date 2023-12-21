import { Button, Dialog, Flex } from "@radix-ui/themes";

import { colorMap } from "../../../../shared/CharacterTypes";
import { type CharacterType, CharacterTypes } from "../../../../types/script";

type Team = CharacterType;
const teams = CharacterTypes;
interface TeamSelectProps {
  currentTeam: Team;
  onSelect: (nextrole: Team | null) => void;
}

export function TeamSelect({ currentTeam, onSelect }: TeamSelectProps) {
  const teamList = teams;

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          variant="soft"
          size="3"
          className="capitalize"
          color={colorMap[currentTeam]}
        >
          <Flex className="w-full text-center" align="center" justify="center">
            {currentTeam}
          </Flex>
        </Button>
      </Dialog.Trigger>
      <Flex direction="column" gap="1" asChild>
        <Dialog.Content>
          {teamList.map((team) => (
            <Dialog.Close key={team}>
              <Button
                className="capitalize"
                size="3"
                color={colorMap[team]}
                variant={team === currentTeam ? "soft" : "outline"}
                onClick={() => onSelect(team)}
              >
                <Flex
                  className="w-full text-center"
                  align="center"
                  justify="center"
                >
                  {team}
                </Flex>
              </Button>
            </Dialog.Close>
          ))}
        </Dialog.Content>
      </Flex>
    </Dialog.Root>
  );
}
