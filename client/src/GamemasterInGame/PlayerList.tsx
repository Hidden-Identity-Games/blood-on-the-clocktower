import {
  Button,
  Checkbox,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Text,
} from "@radix-ui/themes";
import { RoleName } from "../shared/RoleIcon";
import { getCharacter } from "../assets/game_data/gameData";
import { useKickPlayer } from "../store/useStore";
import { GiBootKick, GiFeather } from "react-icons/gi";
import { RxHamburgerMenu } from "react-icons/rx";
import React, { HTMLAttributes, useState } from "react";
import { useDefiniteGame } from "../store/GameContext";
import { DeadVoteIcon, PlayerStatusIcons } from "./NotesIcons";
import { PlayerList } from "./PlayerListComponents";
import { DemonMessage } from "./PlayerListComponents/PlayerMessage/DemonMessage";
import { DialogHeader } from "../shared/DialogHeader";
import {
  PlayerFilter,
  PlayerListFilters,
  usePlayerFilters,
} from "../shared/PlayerListFilters";

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
                  <PlayerList.MenuItem id="kick-player" label="Kick Player">
                    <Dialog.Close>
                      <IconButton
                        onClick={() => handleKickPlayer(player)}
                        disabled={kickPlayerLoading}
                      >
                        <GiBootKick />
                      </IconButton>{" "}
                    </Dialog.Close>
                  </PlayerList.MenuItem>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}
type Action =
  | {
      type: "character";
      name: string;
      player: string;
      order: number;
    }
  | {
      type: "game-action";
      name: string;
      order: number;
    };
const gameActionsByNight = {
  firstNight: [
    { type: "game-action", name: "minions", order: 7 },
    { type: "game-action", name: "demon", order: 8 },
  ] as Action[],
  otherNight: [] as Action[],
};
export function NightPlayerList() {
  const { game } = useDefiniteGame();
  const nightKey = game.gameStatus === "Setup" ? "firstNight" : "otherNight";
  const nightActions = React.useMemo(() => {
    const playerActions = game.playerList
      .map((player) => ({
        player,
        role: game.playersToRoles[player],
        ...getCharacter(game.playersToRoles[player]),
      }))
      .filter((character) => !!character[nightKey])
      .map<Action>(({ player, id, ...character }) => ({
        type: "character",
        name: `${player}-${id}`,
        player,
        order: character[nightKey]!.order,
      }));
    const gameActions = gameActionsByNight[nightKey];
    return [...playerActions, ...gameActions].sort((a, b) => a.order - b.order);
  }, [nightKey, game]);
  const leftoverPlayers = game.playerList
    .filter(
      (player) => !getCharacter(game.playersToRoles[player])[nightKey]?.order,
    )
    .sort()
    .map((player) => ({
      type: "character",
      name: `${player}_undone`,
      player,
      order: 1000,
    }));

  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>(
    Object.fromEntries(nightActions.map((action) => [action.name, true])),
  );

  return (
    <Flex className="overflow-y-auto" direction="column" py="3" gap="2">
      {[...nightActions, ...leftoverPlayers].map((action) => (
        <React.Fragment key={action.name}>
          <Text size="4" asChild>
            <Flex justify="between" align="center" px="3" gap="3">
              <Checkbox
                id={`${action.name}-done`}
                checked={checkedActions[action.name]}
                onClick={() =>
                  setCheckedActions({
                    ...checkedActions,
                    [action.name]: !checkedActions[action.name],
                  })
                }
              />
              {action.type === "character" && (
                <>
                  <PlayerList.RoleIcon player={action.player}>
                    <PlayerList.NightReminder player={action.player} />
                  </PlayerList.RoleIcon>
                  <PlayerList.NoteInputModal
                    player={action.player}
                    note={game.playerNotes[action.player]}
                  >
                    <button className="flex-1 text-left">
                      <PlayerList.Name player={action.player} />
                    </button>
                  </PlayerList.NoteInputModal>
                  <PlayerList.Actions player={action.player} />
                </>
              )}
              {action.type === "game-action" && (
                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button variant="soft" className="flex-1 capitalize">
                      {action.name}
                    </Button>
                  </Dialog.Trigger>
                  <Dialog.Content>
                    {action.name === "demon" && (
                      <>
                        <DialogHeader>Demon</DialogHeader>
                        <DemonMessage />
                      </>
                    )}
                    {action.name === "minions" && (
                      <>
                        <DialogHeader>Minions</DialogHeader>
                        <Heading>
                          Wake up the minions, and show them who their demon is.
                        </Heading>
                      </>
                    )}
                  </Dialog.Content>
                </Dialog.Root>
              )}
            </Flex>
          </Text>

          {action.type === "character" && (
            <PlayerNotes
              className="mt-[-0.5em] px-[5em] py-1"
              player={action.player}
            />
          )}
        </React.Fragment>
      ))}
    </Flex>
  );
}

export function IngamePlayerList() {
  const { game } = useDefiniteGame();
  const [selectedFilter, setSelectedFilter] = useState<PlayerFilter>("all");
  const allFilters = usePlayerFilters(game.playerList);
  const filteredPlayers = allFilters[selectedFilter];

  return (
    <Flex className="overflow-y-auto" direction="column" py="3" gap="2">
      <PlayerListFilters
        allFilters={allFilters}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
      {filteredPlayers.map((player) => (
        <Flex direction="column" key={player}>
          <Text size="4" asChild>
            <Flex justify="between" align="center" px="3" gap="3">
              <PlayerList.RoleIcon player={player}>
                {getCharacter(game.playersToRoles[player]).ability}
              </PlayerList.RoleIcon>
              <PlayerList.NoteInputModal
                player={player}
                note={game.playerNotes[player]}
              >
                <button className="flex-1 text-left">
                  <PlayerList.Name player={player} />
                </button>
              </PlayerList.NoteInputModal>
              <DeadVoteIcon player={player} />
              <PlayerList.Actions player={player} />
            </Flex>
          </Text>

          <PlayerNotes className="px-[3em] py-1" player={player} />
        </Flex>
      ))}
    </Flex>
  );
}

interface PlayerNotesProps extends HTMLAttributes<HTMLDivElement> {
  player: string;
}

function PlayerNotes({ player, ...props }: PlayerNotesProps) {
  const { game } = useDefiniteGame();
  const statuses = game.playerPlayerStatuses[player] ?? [];
  const notes = game.playerNotes[player] ?? "";
  if (!notes && !statuses.length) return;

  return (
    <Text size="2" weight="light" asChild>
      <Flex direction="column" gap="2" {...props}>
        {statuses.length > 0 && (
          <Flex gap="3">
            <PlayerStatusIcons player={player} />
          </Flex>
        )}
        {notes && (
          <PlayerList.NoteInputModal player={player} note={notes}>
            <button className="ml-1 flex-1 whitespace-pre-line text-left">
              <Flex gap="2">
                <GiFeather />
                {notes}
              </Flex>
            </button>
          </PlayerList.NoteInputModal>
        )}
      </Flex>
    </Text>
  );
}
