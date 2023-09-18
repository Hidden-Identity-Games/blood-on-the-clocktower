import { Button, Dialog, Flex, Heading, IconButton } from "@radix-ui/themes";
import { CharacterTypes } from "../../../types/script";
import { teamColorMap } from "../../../shared/CharacterTypes";
import { PlusIcon } from "@radix-ui/react-icons";

const teamMap = {
  Demon: "Evil",
  Minion: "Evil",
  Evil: "Evil",
  Good: "Good",
  Outsider: "Good",
  Townsfolk: "Good",
  Unknown: "Good",
  Traveler: "Good",
} as const;

export function onSameTeam(team1: Team, team2: Team): boolean {
  return teamMap[team1] === teamMap[team2];
}
export function otherTeam(team1: Team): "Evil" | "Good" {
  return teamMap[team1] === "Good" ? "Evil" : "Good";
}

export function getAlignment(team: Team): "Evil" | "Good" {
  return teamMap[team];
}

export const teams = [
  "Good",
  ...CharacterTypes,
  "Evil",
  "Unknown",
  // TODO: get rid of
  "Traveler",
] as const;
export type Team = (typeof teams)[number];
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
          color={teamColorMap[getAlignment(currentTeam)]}
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
                color={teamColorMap[getAlignment(team)]}
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

interface TeamSelectListProps {
  addTeam: () => void;
  replaceTeam: (replaceValue: Team | null, index: number) => void;
  team: Team[];
}

export function TeamSelectList({
  team,
  addTeam,
  replaceTeam,
}: TeamSelectListProps) {
  return (
    <>
      <Heading className="flex items-center gap-1">
        Team{" "}
        <IconButton
          variant="ghost"
          radius="full"
          className="pt-1"
          onClick={() => {
            addTeam();
          }}
        >
          <PlusIcon />
        </IconButton>
      </Heading>
      {[...team].map((current, index) => (
        <TeamSelect
          key={current}
          currentTeam={current}
          onSelect={(newItem) => replaceTeam(newItem, index)}
        />
      ))}
    </>
  );
}
