import { Checkbox, Dialog, Flex, IconButton, Text } from "@radix-ui/themes";
import { RoleName } from "../shared/RoleIcon";
import { getCharacter } from "../assets/game_data/gameData";
import { useKickPlayer } from "../store/useStore";
import { GiBootKick, GiFeather } from "react-icons/gi";
import { RxHamburgerMenu } from "react-icons/rx";
import classNames from "classnames";
import React, { useState } from "react";
import { useDefiniteGame } from "../store/GameContext";
import { DeadVoteIcon, PlayerStatusIcons } from "./NotesIcons";
import { PlayerList } from "./PlayerListComponents";
import { PlayerMenuItem } from "./PlayerListComponents/PlayerActions";
import { PlayerNoteInput } from "./PlayerListComponents/PlayerNoteInput";

export function PregamePlayerList() {
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
              <Dialog.Trigger>
                <IconButton variant="ghost">
                  <RxHamburgerMenu />
                </IconButton>
              </Dialog.Trigger>
              <Dialog.Content className="m-2">
                <Flex direction="column" gap="2">
                  <PlayerMenuItem id="kick-player" label="Kick Player">
                    <Dialog.Close>
                      <IconButton
                        onClick={() => handleKickPlayer(player)}
                        disabled={kickPlayerLoading}
                      >
                        <GiBootKick />
                      </IconButton>{" "}
                    </Dialog.Close>
                  </PlayerMenuItem>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}

export function NightPlayerList() {
  const { game } = useDefiniteGame();
  const nightKey = game.gameStatus === "Setup" ? "firstNight" : "otherNight";
  const nightOrder = React.useMemo(() => {
    return game.playerList
      .map((player) => ({
        player,
        role: game.playersToRoles[player],
        ...getCharacter(game.playersToRoles[player]),
      }))
      .sort((a, b) => (a[nightKey]?.order ?? 0) - (b[nightKey]?.order ?? 0));
  }, [nightKey, game]);
  const [checkedPlayers, setCheckedPlayers] = useState<Record<string, boolean>>(
    Object.fromEntries(
      nightOrder
        .filter(({ player }) => !game.deadPlayers[player])
        .filter((character) => character[nightKey])
        .map(({ player }) => [player, true]),
    ),
  );

  return (
    <Flex className="overflow-y-auto" direction="column" py="3" gap="2">
      {nightOrder.map(({ player }, idx) => (
        <React.Fragment key={player}>
          <Text size="3" asChild>
            <Flex
              className={classNames(idx % 2 === 0 && "bg-zinc-900")}
              justify="between"
              align="center"
              px="3"
              gap="3"
              key={player}
            >
              <Checkbox
                id={`${player}-done`}
                checked={checkedPlayers[player]}
                onClick={() =>
                  setCheckedPlayers({
                    ...checkedPlayers,
                    [player]: !checkedPlayers[player],
                  })
                }
              />
              <PlayerList.RoleIcon night player={player} />
              <PlayerList.Name player={player} />
              <PlayerStatusIcons player={player} />
              <PlayerList.ShowMessage player={player} />
              <PlayerList.Actions player={player} />
            </Flex>
          </Text>
        </React.Fragment>
      ))}
    </Flex>
  );
}

export function IngamePlayerList() {
  const { game } = useDefiniteGame();

  const playerList = game.orderedPlayers.problems
    ? game.playerList
    : game.orderedPlayers.fullList;

  return (
    <Flex className="overflow-y-auto" direction="column" py="3" gap="2">
      {playerList.map((player) => (
        <Flex direction="column" key={player}>
          <Text size="4" asChild>
            <Flex justify="between" align="center" px="3" gap="3">
              <PlayerList.RoleIcon player={player} />
              <PlayerList.Name player={player} />
              <PlayerNoteInput player={player} note={game.playerNotes[player]}>
                <IconButton variant="soft" size="1" radius="full">
                  <GiFeather />
                </IconButton>
              </PlayerNoteInput>
              <DeadVoteIcon player={player} />
              <PlayerList.Actions player={player} />
            </Flex>
          </Text>

          <PlayerNotes player={player} />
        </Flex>
      ))}
    </Flex>
  );
}

interface PlayerNotesProps {
  player: string;
}

function PlayerNotes({ player }: PlayerNotesProps) {
  const { game } = useDefiniteGame();
  const statuses = game.playerPlayerStatuses[player] ?? [];
  const notes = game.playerNotes[player] ?? "";
  if (!notes && !statuses.length) return;

  return (
    <Text size="2" weight="light" asChild>
      <Flex className="px-[3em] py-1" direction="column" gap="2">
        {statuses.length > 0 && (
          <Flex gap="3">
            <PlayerStatusIcons player={player} />
          </Flex>
        )}
        {notes && (
          <Flex ml="1" gap="2">
            <GiFeather />
            <PlayerNoteInput player={player} note={notes}>
              <button className="flex-1 whitespace-pre-line text-left">
                {notes}
              </button>
            </PlayerNoteInput>
          </Flex>
        )}
      </Flex>
    </Text>
  );
}
