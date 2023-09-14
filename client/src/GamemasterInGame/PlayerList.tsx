import {
  Checkbox,
  Dialog,
  Flex,
  IconButton,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { RoleIcon, RoleName, RoleText } from "../shared/RoleIcon";
import { getRole, getRoleExtension } from "../assets/game_data/gameData";
import { useDecideFate, useKickPlayer } from "../store/useStore";
import { MeaningfulIcon } from "../shared/MeaningfulIcon";
import { GiBootKick, GiRaiseZombie } from "react-icons/gi";
// import { MdDriveFileRenameOutline } from "react-icons/md";
import { PiKnifeBold } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import classNames from "classnames";
import {
  BrokenOrderedPlayers,
  Role,
  WellOrderedPlayers,
} from "@hidden-identity/server";
import { IconType } from "react-icons";
import React from "react";

interface PregamePlayerListProps {
  playersToRoles: Record<string, Role>;
  orderedPlayers: WellOrderedPlayers | BrokenOrderedPlayers;
}

export function PregamePlayerList({
  playersToRoles,
  orderedPlayers,
}: PregamePlayerListProps) {
  const [, kickPlayerLoading, , handleKickPlayer] = useKickPlayer();
  const seatingProblems =
    orderedPlayers.problems && orderedPlayers.playerProblems;

  return (
    <Flex className="overflow-y-auto" direction="column" py="3" gap="2">
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
              <Dialog.Content>
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
                      icon={GiBootKick}
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
  // playerDisplayOrder: string[];
  playersToRoles: Record<string, Role>;
  deadPlayers: Record<string, boolean>;
  night: null | "first" | "other";
  checkedPlayers: Record<string, boolean>;
  setCheckedPlayers: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}

export function IngamePlayerList({
  playersToRoles,
  deadPlayers,
  night,
  checkedPlayers,
  setCheckedPlayers,
}: IngamePlayerListProps) {
  const [, decideFateLoading, , handleDecideFate] = useDecideFate();

  const nightOrder = React.useMemo(() => {
    return Object.entries(playersToRoles)
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
  }, [night, playersToRoles]);

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
          <Text
            className={classNames(deadPlayers[player] && "line-through")}
            size="2"
          >
            <Tooltip content={role}>
              <MeaningfulIcon
                className="aspect-square h-4"
                size="1"
                color="purple"
                header={
                  <div className="flex items-center justify-center gap-1">
                    <RoleIcon role={role} />
                    {RoleName(role)}
                  </div>
                }
                explanation={(() => {
                  let ability = "";
                  switch (night) {
                    case null:
                      ability = rowData.ability;
                      break;
                    case "first":
                      ability = rowData.firstNightReminder;
                      break;
                    case "other":
                      ability = rowData.otherNightReminder;
                      break;
                  }

                  return ability ? (
                    <div>{ability}</div>
                  ) : (
                    <div>
                      <div>DOES NOT ACT TONIGHT</div>
                      <div>{rowData.ability}</div>
                    </div>
                  );
                })()}
              >
                <RoleIcon role={role} dead={deadPlayers[player]} />
              </MeaningfulIcon>
            </Tooltip>

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

            <label htmlFor={`${player}-done`}>
              <RoleText className="flex-1" role={playersToRoles[player]}>
                {player}
              </RoleText>
            </label>
            <label
              htmlFor={`${player}-done`}
              className="truncate capitalize"
              style={{
                flex: 2,
              }}
            >
              {RoleName(playersToRoles[player])}
            </label>

            <Dialog.Root>
              <Dialog.Trigger>
                <IconButton variant="ghost">
                  <RxHamburgerMenu />
                </IconButton>
              </Dialog.Trigger>
              <Dialog.Content className="w-fit">
                <Flex direction="column" gap="2">
                  <Dialog.Close>
                    <PlayerMenuItem
                      id="dead-alive"
                      label={deadPlayers[player] ? "Revive" : "Kill"}
                      icon={deadPlayers[player] ? GiRaiseZombie : PiKnifeBold}
                      onClick={() =>
                        handleDecideFate(player, !deadPlayers[player])
                      }
                      disabled={decideFateLoading}
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

interface PlayerMenuItemProps {
  id: string;
  label: string;
  icon: IconType;
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
        {React.createElement(icon)}
      </IconButton>
      <label htmlFor={id} className="flex-1 p-1">
        {label}
      </label>
    </Flex>
  );
}
