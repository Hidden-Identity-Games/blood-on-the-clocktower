import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";

import { shadCnColorMap } from "../../../../shared/CharacterTypes";
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
      <Dialog.Trigger asChild>
        <Button
          variant="soft"
          className="capitalize"
          color={shadCnColorMap[currentTeam]}
        >
          <div className="flex w-full items-center justify-center text-center">
            {currentTeam}
          </div>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="flex flex-col gap-1">
        <Dialog.Header>Team</Dialog.Header>
        {teamList.map((team) => (
          <Dialog.Close asChild key={team}>
            <Button
              className="w-full capitalize"
              color={shadCnColorMap[team]}
              variant={team === currentTeam ? "soft" : "outline"}
              onClick={() => onSelect(team)}
            >
              <div className="flex w-full items-center justify-center text-center">
                {team}
              </div>
            </Button>
          </Dialog.Close>
        ))}
      </Dialog.Content>
    </Dialog.Root>
  );
}
