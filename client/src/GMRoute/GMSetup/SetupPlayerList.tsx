import { Dialog } from "@design-system/components/ui/dialog";
import { Flex, IconButton, Text } from "@radix-ui/themes";
import { GiBootKick } from "react-icons/gi";
import { RxHamburgerMenu } from "react-icons/rx";

import { RoleName } from "../../shared/RoleIcon";
import { useKickPlayer } from "../../store/actions/playerActions";
import { useDefiniteGame } from "../../store/GameContext";
import { PlayerList } from "../GMShared/PlayerListComponents";

export function SetupPlayerList() {
  const { game } = useDefiniteGame();
  const [, kickPlayerLoading, , handleKickPlayer] = useKickPlayer();
  const seatingProblems =
    game.orderedPlayers.problems && game.orderedPlayers.playerProblems;

  return (
    <Flex className="overflow-y-auto" direction="column" py="3" gap="2">
      {Object.entries(game.playersToRoles).length === 0 && (
        <Text as="div" className="m-5 text-center">
          No players have joined yet. Share the game by clicking the game code.
        </Text>
      )}
      {Object.entries(game.playersToRoles).map(([player, role]) => (
        <Flex
          justify="between"
          align="center"
          px="3"
          gap="3"
          key={player}
          asChild
        >
          <Text size="2">
            <PlayerList.Name player={player} />
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

            <Dialog.Root>
              <Dialog.Trigger asChild>
                <IconButton variant="ghost">
                  <RxHamburgerMenu />
                </IconButton>
              </Dialog.Trigger>
              <Dialog.Content className="m-2">
                <Dialog.Description>
                  <Flex direction="column" gap="2">
                    <Dialog.Close asChild>
                      <PlayerList.MenuItem
                        id="kick-player"
                        label="Kick Player"
                        onClick={() => void handleKickPlayer(player)}
                        disabled={kickPlayerLoading}
                      >
                        <GiBootKick />
                      </PlayerList.MenuItem>
                    </Dialog.Close>
                  </Flex>
                </Dialog.Description>
              </Dialog.Content>
            </Dialog.Root>
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}
