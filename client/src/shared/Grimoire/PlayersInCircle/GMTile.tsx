import { Dialog } from "@design-system/components/ui/dialog";
import {
  type AppliedPlayerReminder,
  getCharacter,
} from "@hidden-identity/shared";
import classNames from "classnames";
import React from "react";
import { FaEllipsis } from "react-icons/fa6";
import useResizeObserver from "use-resize-observer";

// import { PlayerStatusIcon } from "../../../GMRoute/GMInGame/NotesIcons";
import { PlayerList } from "../../../GMRoute/GMShared/PlayerListComponents";
import { useClearPlayerReminder } from "../../../store/actions/gmPlayerActions";
import { useDefiniteGame } from "../../../store/GameContext";
import { useGetPlayerAlignment } from "../../../store/useStore";
import { alignmentColorMap } from "../../CharacterTypes";
import { ReminderIcon } from "../../Reminders/ReminderIcon";
import { getRoleIcon } from "../../RoleIcon";
import { PlaceInCircle } from ".";
import { useScalingTextClassName } from "./ScalingText";

export interface TileProps {
  player: string;
  index: number;
}

export function HiddenTile({ player, index }: TileProps) {
  const { ref, width = 0 } = useResizeObserver();
  const scalingTextclass = useScalingTextClassName(width);

  return (
    <PlaceInCircle index={index} stepsIn={1}>
      <div className="h-full w-full p-2">
        <div
          ref={ref}
          className={classNames(
            scalingTextclass,
            "flex h-full w-full items-center justify-around rounded-full bg-accent capitalize",
          )}
        >
          {player}
        </div>
      </div>
    </PlaceInCircle>
  );
}
export function GMTile({ player, index }: TileProps) {
  const { game } = useDefiniteGame();
  const { ref, width = 0 } = useResizeObserver();
  const scalingTextclass = useScalingTextClassName(width);
  const role = game.playersToRoles[player];
  const baseReminders = game.reminders
    .filter(({ active, toPlayer }) => active && toPlayer === player)
    .slice(0, 2);
  const overflowReminders = game.reminders
    .filter(({ active, toPlayer }) => active && toPlayer === player)
    .slice(2);
  const showOverflowReminders = overflowReminders.length > 1;
  const remindersToRender = showOverflowReminders
    ? baseReminders
    : [...baseReminders, ...overflowReminders];
  const activeQueueItem = game.actionQueue.find(
    (item) => item.status === "todo",
  );

  const getPlayerAlignment = useGetPlayerAlignment();

  return (
    <>
      {remindersToRender.map((reminder, idx) => (
        <PlaceInCircle index={index} stepsIn={2 + idx / 2} key={reminder.id}>
          {/* We need to add pointer events manually to prevent the div from overlapping us, because corners bullshit */}
          <ClearReminderButton reminder={reminder} />
        </PlaceInCircle>
      ))}
      {showOverflowReminders && (
        <PlaceInCircle index={index} stepsIn={2 + baseReminders.length / 2}>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="pointer-events-auto rounded-full bg-green-600 p-1">
                <FaEllipsis size="24" color="white" />
              </button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Header>Reminders</Dialog.Header>
              <div className="columns-4 gap-x-3">
                {[...baseReminders, ...overflowReminders].map((reminder) => (
                  <Dialog.Close asChild>
                    <ClearReminderButton reminder={reminder} />
                  </Dialog.Close>
                ))}
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </PlaceInCircle>
      )}
      <PlaceInCircle key={player} index={index} stepsIn={1}>
        <div className="z-10 h-full w-full p-2">
          <PlayerList.Actions player={player}>
            <button className="pointer-events-auto relative h-full w-full">
              <div
                data-testid={`tile_${player}`}
                ref={ref}
                className={classNames(
                  scalingTextclass,
                  "h-full w-full group flex flex-col p-2 hover:z-30  bg-opacity-70 rounded-full justify-around items-center hover:opacity-100",
                  {
                    "outline outline-8 outline-red-500 opacity-10":
                      game.deadPlayers[player] && game.deadVotes[player],
                    "opacity-50":
                      game.deadPlayers[player] && !game.deadVotes[player],
                  },
                  activeQueueItem?.player === player
                    ? "bg-destructive scale-125"
                    : "bg-accent",
                )}
              >
                <>
                  <TextAlongTopOfCircle
                    stroke={`hsla(${
                      alignmentColorMap[getPlayerAlignment(player)]
                    })`}
                    // stroke="white"
                  >
                    {getCharacter(role).name}
                  </TextAlongTopOfCircle>
                  <img
                    className="mx-auto block aspect-[15/9] flex-1 bg-cover object-cover object-[0_0%] p-1"
                    src={getRoleIcon(getCharacter(role))}
                  />
                </>

                <div
                  className={classNames(
                    "line-clamp-1 truncate capitalize bg-transparent w-[100%] ",
                    {
                      "line-through": game.deadPlayers[player],
                    },
                    // a temporary hack, the image and role text are not the same size, and I can't fix why
                  )}
                >
                  {player}
                </div>
              </div>
            </button>
          </PlayerList.Actions>
        </div>
      </PlaceInCircle>
    </>
  );
}

interface ClearReminderButtonProps {
  reminder: AppliedPlayerReminder;
}
function ClearReminderButton({ reminder }: ClearReminderButtonProps) {
  const [, isClearReminderLoading, , clearReminder] = useClearPlayerReminder();

  return (
    <button
      className="group pointer-events-auto h-1/2 w-1/2 rounded-full bg-primary opacity-[50%] hover:opacity-[100%]"
      onClick={() => void clearReminder(reminder.id)}
      disabled={isClearReminderLoading}
    >
      <ReminderIcon reminderName={reminder.name} useReminderTypeColor>
        <div className="absolute left-[50%] top-[50%] hidden -translate-x-1/2 -translate-y-1/2 rounded-lg bg-primary/50 text-base capitalize text-green-500 group-hover:block">
          {reminder.name}
        </div>
      </ReminderIcon>
    </button>
  );
}

interface TextAlongTopOfCircleProps extends React.SVGProps<SVGTextPathElement> {
  children: React.ReactNode;
}

export function TextAlongTopOfCircle({
  children,
  stroke,
  ...props
}: TextAlongTopOfCircleProps) {
  return (
    <>
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        stroke="none"
        className="absolute inset-1"
        fill="none"
      >
        <path
          id="circlePath"
          d="
      M 10, 50
      a 40,40 0 1,1 80,0
      40,40 0 1,1 -80,0
    "
        />
        <text stroke={stroke}>
          <textPath
            href="#circlePath"
            textAnchor="middle"
            startOffset="25%"
            fontSize="0.75rem"
            {...props}
          >
            {children}
          </textPath>
        </text>
      </svg>
    </>
  );
}
