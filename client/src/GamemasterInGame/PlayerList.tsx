import {
  Button,
  Checkbox,
  Dialog,
  Flex,
  IconButton,
  Text,
  TextFieldInput,
} from "@radix-ui/themes";
import { RoleIcon, RoleName, RoleText } from "../shared/RoleIcon";
import { getRole, getRoleExtension } from "../assets/game_data/gameData";
import {
  usePlayerNotes,
  useDeadVote,
  useDecideFate,
  useKickPlayer,
} from "../store/useStore";
import { MeaningfulIcon } from "../shared/MeaningfulIcon";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { FaVial } from "react-icons/fa6";
import { IoIosBeer } from "react-icons/io";
import { GiBootKick, GiFeather, GiRaiseZombie } from "react-icons/gi";
// import { MdDriveFileRenameOutline } from "react-icons/md";
import { PiKnifeBold } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import classNames from "classnames";
import React, { ReactNode } from "react";
import { useDefiniteGame } from "../store/GameContext";
import { DeadVoteIcon, NotesIcons } from "./NotesIcons";

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
            <RoleText className="flex-1" role={role}>
              {player}
            </RoleText>
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
                  {/* <PlayerMenuItem
                    id="rename"
                    label="Rename"
                    icon={MdDriveFileRenameOutline}
                    onClick={() => {}}
                    disabled={true}
                  /> */}
                  <Dialog.Close>
                    <PlayerMenuItem
                      id="kick-player"
                      label="Kick Player"
                      icon={<GiBootKick />}
                      onClick={() => handleKickPlayer(player)}
                      disabled={kickPlayerLoading}
                    />
                  </Dialog.Close>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}

interface IngamePlayerListProps {
  night: null | "first" | "other";
  checkedPlayers: Record<string, boolean>;
  setCheckedPlayers: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}

export function IngamePlayerList({
  night,
  checkedPlayers,
  setCheckedPlayers,
}: IngamePlayerListProps) {
  const { game } = useDefiniteGame();
  const [, decideFateLoading, , handleDecideFate] = useDecideFate();
  const [, deadVoteLoading, , setDeadVote] = useDeadVote();
  const [, playerNotesLoading, , setPlayerNote] = usePlayerNotes();

  const nightOrder = React.useMemo(() => {
    return Object.entries(game.playersToRoles)
      .map(([player, role]) => ({
        player,
        role,
        ...getRole(role),
        ...getRoleExtension(role),
      }))
      .sort((a, b) =>
        night === "first"
          ? a.firstNight - b.firstNight
          : a.otherNight - b.otherNight,
      );
  }, [night, game.playersToRoles]);

  return (
    <Flex className="overflow-y-auto" direction="column" py="3" gap="2">
      {nightOrder.map(({ role, player: player, ...rowData }) => (
        <Flex
          justify="between"
          align="center"
          px="3"
          gap="3"
          key={player}
          asChild
        >
          <Text size="2">
            {night && (
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
            )}

            <MeaningfulIcon
              className="aspect-square h-4"
              size="1"
              color={
                ["Townsfolk", "Outsider"].includes(getRole(role).team)
                  ? "cyan"
                  : "crimson"
              }
              header={
                <div className="flex items-center justify-center gap-1">
                  <RoleIcon role={role} />
                  {RoleName(role)}
                </div>
              }
              explanation={(() => {
                switch (night) {
                  case null:
                    return rowData.ability;
                  case "first":
                    return (
                      <div>
                        <div>
                          {!rowData.firstNightReminder &&
                            "DOES NOT ACT TONIGHT"}
                        </div>
                        {rowData.firstNightReminder || rowData.ability}
                      </div>
                    );
                  case "other":
                    <div>
                      <div>
                        {!rowData.otherNightReminder && "DOES NOT ACT TONIGHT"}
                      </div>
                      {rowData.otherNightReminder || rowData.ability}
                    </div>;
                }
              })()}
            >
              <RoleIcon role={role} />
            </MeaningfulIcon>
            <DeadVoteIcon player={player} />

            <RoleText
              className={classNames(
                "flex-1",
                game.deadPlayers[player] && "line-through",
              )}
              role={game.playersToRoles[player]}
            >
              {player}
            </RoleText>

            <NotesIcons player={player} />

            <Dialog.Root>
              <Dialog.Trigger>
                <IconButton variant="ghost">
                  <RxHamburgerMenu />
                </IconButton>
              </Dialog.Trigger>

              <Dialog.Content className="m-2">
                <Flex direction="column" gap="2">
                  <Dialog.Close>
                    <PlayerMenuItem
                      id="dead-alive"
                      label={game.deadPlayers[player] ? "Revive" : "Kill"}
                      icon={
                        game.deadPlayers[player] ? (
                          <GiRaiseZombie />
                        ) : (
                          <PiKnifeBold />
                        )
                      }
                      onClick={() =>
                        handleDecideFate(player, !game.deadPlayers[player])
                      }
                      disabled={decideFateLoading}
                    />
                  </Dialog.Close>
                  <PlayerMenuItem
                    id="player-note"
                    label="Add Note"
                    icon={
                      <PlayerNoteInput
                        player={player}
                        handleAddNote={(note) =>
                          setPlayerNote(player, "add", {
                            type: "custom",
                            message: note,
                            id: `${player}-${note}`,
                          })
                        }
                      />
                    }
                    onClick={() => {}}
                    disabled={playerNotesLoading}
                  />
                  <Dialog.Close>
                    <PlayerMenuItem
                      id="set-poison"
                      label="Poisoned"
                      icon={<FaVial />}
                      onClick={() =>
                        setPlayerNote(player, "add", {
                          type: "poison",
                          id: `${player}-poisoned`,
                        })
                      }
                    />
                  </Dialog.Close>
                  <Dialog.Close>
                    <PlayerMenuItem
                      id="set-drunk"
                      label="Drunk"
                      icon={<IoIosBeer />}
                      onClick={() =>
                        setPlayerNote(player, "add", {
                          type: "drunk",
                          id: `${player}-drunk`,
                        })
                      }
                    />
                  </Dialog.Close>
                  {game.deadPlayers[player] && game.deadVotes[player] && (
                    <Dialog.Close>
                      <PlayerMenuItem
                        id="dead-vote"
                        label={
                          game.deadVotes[player]
                            ? "Refund Dead Vote"
                            : "Use Dead Vote"
                        }
                        icon={
                          game.deadVotes[player] ? (
                            <AiFillPlusCircle />
                          ) : (
                            <AiFillMinusCircle />
                          )
                        }
                        onClick={() => setDeadVote(player, false)}
                        disabled={deadVoteLoading}
                      />
                    </Dialog.Close>
                  )}
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}

interface PlayerMenuItemProps {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

function PlayerMenuItem({
  id,
  label,
  icon,
  onClick,
  disabled = false,
}: PlayerMenuItemProps) {
  return (
    <Flex className="text-xl" gap="3">
      <IconButton
        id={id}
        variant="soft"
        size="4"
        disabled={disabled}
        onClick={onClick}
      >
        {icon}
      </IconButton>
      <label htmlFor={id} className="flex-1 p-1">
        {label}
      </label>
    </Flex>
  );
}

interface PlayerNoteInputProps {
  player: string;
  handleAddNote: (note: string) => void;
  disabled?: boolean;
}

function PlayerNoteInput({
  player,
  handleAddNote,
  disabled = false,
}: PlayerNoteInputProps) {
  const [note, setNote] = React.useState("");

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton variant="ghost" disabled={disabled}>
          <GiFeather />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content className="m-2">
        <Dialog.Title className="capitalize">{player}: Add Note</Dialog.Title>
        <Flex direction="column" gap="4">
          <TextFieldInput
            value={note}
            onChange={(event) => setNote(event.currentTarget.value)}
          />
          <Flex justify="between">
            <Dialog.Close>
              <Button>Cancel</Button>
            </Dialog.Close>

            <Dialog.Close>
              <Button onClick={() => handleAddNote(note)}>Add</Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
