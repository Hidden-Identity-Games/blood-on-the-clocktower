import { Flex, IconButton, Popover, Text, Tooltip } from "@radix-ui/themes";
import { RoleIcon, RoleName, RoleText } from "../shared/RoleIcon";
import { GiBootKick } from "react-icons/gi";
import { RxHamburgerMenu } from "react-icons/rx";
import classNames from "classnames";
import {
  BrokenOrderedPlayers,
  Role,
  WellOrderedPlayers,
} from "@hidden-identity/server";
import { useKickPlayer } from "../store/useStore";

interface PlayerListProps {
  playersToRoles: Record<string, Role>;
  orderedPlayers: WellOrderedPlayers | BrokenOrderedPlayers;
  isGameStarted: boolean;
}

export function PlayerList({
  playersToRoles,
  orderedPlayers,
  isGameStarted,
}: PlayerListProps) {
  const [, kickPlayerLoading, , handleKickPlayer] = useKickPlayer();
  const seatingProblems =
    orderedPlayers.problems && orderedPlayers.playerProblems;

  return (
    <Flex direction="column" py="3" gap="2" style={{ overflowY: "auto" }}>
      {Object.entries(playersToRoles).length === 0 && (
        <Text as="div" className="m-5 text-center">
          No players have joined yet. Share the game by clicking the game code.
        </Text>
      )}
      {Object.entries(playersToRoles).map(([player, role]) => (
        <Flex
          justify="between"
          align="center"
          px="3"
          gap="3"
          key={player}
          asChild
        >
          <Text size="2">
            <RoleText className="flex-1" role={role}>
              {player}
            </RoleText>
            <RoleIcon
              role={role}
              className={classNames("h-4", {
                ["opacity-0"]: role === "unassigned",
              })}
            />
            {seatingProblems ? (
              <Text as="div">
                {seatingProblems[player] ? "Getting settled" : "Ready"}
              </Text>
            ) : (
              <div
                className="truncate capitalize"
                style={{
                  flex: 2,
                }}
              >
                {RoleName(role)}
              </div>
            )}

            <Popover.Root>
              <Popover.Trigger>
                <IconButton variant="ghost">
                  <RxHamburgerMenu />
                </IconButton>
              </Popover.Trigger>
              <Popover.Content>
                <Tooltip content="Kick player">
                  <IconButton
                    variant="soft"
                    size="4"
                    disabled={isGameStarted || kickPlayerLoading}
                    onClick={() => handleKickPlayer(player)}
                  >
                    <GiBootKick />
                  </IconButton>
                </Tooltip>
              </Popover.Content>
            </Popover.Root>
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}
