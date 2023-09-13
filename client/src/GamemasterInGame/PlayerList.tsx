import { Button, Flex, IconButton, Text } from "@radix-ui/themes";
import { useDefiniteGame } from "../store/GameContext";
import { RoleIcon, RoleName, RoleText } from "../shared/RoleIcon";
import { useKickPlayer, useDecideFate } from "../store/useStore";
import classNames from "classnames";
import { PiKnifeBold } from "react-icons/pi";
import { GiRaiseZombie } from "react-icons/gi";

export function PlayerList() {
  const { game } = useDefiniteGame();
  const [, kickPlayerLoading, , handleKickPlayer] = useKickPlayer();
  const [, decideFateLoading, , handleDecideFate] = useDecideFate();
  const seatingProblems =
    game.orderedPlayers.problems && game.orderedPlayers.playerProblems;
  return (
    <>
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
          className={classNames(game.deadPlayers[player] && "line-through")}
          key={player}
          asChild
        >
          <Text size="2">
            <RoleText className="flex-1" role={role}>
              {player}
            </RoleText>
            <RoleIcon
              role={role}
              dead={game.deadPlayers[player]}
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

            {game.gameStarted ? (
              <>
                <IconButton
                  variant="surface"
                  size="1"
                  onClick={() => {
                    if (decideFateLoading) {
                      return;
                    }
                    handleDecideFate(player, !game.deadPlayers[player]);
                  }}
                >
                  {game.deadPlayers[player] ? (
                    <GiRaiseZombie />
                  ) : (
                    <PiKnifeBold />
                  )}
                </IconButton>
              </>
            ) : (
              <Button
                disabled={kickPlayerLoading}
                size="1"
                onClick={() => handleKickPlayer(player)}
              >
                {kickPlayerLoading ? "Kicking..." : "Kick"}
              </Button>
            )}
          </Text>
        </Flex>
      ))}
    </>
  );
}
