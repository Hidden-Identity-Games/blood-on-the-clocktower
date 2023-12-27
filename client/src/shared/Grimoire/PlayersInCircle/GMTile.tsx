import { getCharacter } from "@hidden-identity/shared";
import classNames from "classnames";
import { FaEllipsis } from "react-icons/fa6";
import useResizeObserver from "use-resize-observer";

// import { PlayerStatusIcon } from "../../../GMRoute/GMInGame/NotesIcons";
import { PlayerList } from "../../../GMRoute/GMShared/PlayerListComponents";
import { useDefiniteGame } from "../../../store/GameContext";
import { AddPlayerReminder } from "../../PlayerReminder";
import { getRoleIcon, RoleText } from "../../RoleIcon";
import { PlaceInCircle } from ".";
import { useScalingTextClassName } from "./ScalingText";

export interface SpectatorTile {
  player: string;
  index: number;
}
export function GMTile({ player, index }: SpectatorTile) {
  const { game } = useDefiniteGame();
  const { ref, width = 0 } = useResizeObserver();
  const scalingTextclass = useScalingTextClassName(width);
  const role = game.playersToRoles[player];
  const baseStatuses = game.reminders
    .filter(({ toPlayer }) => toPlayer === player)
    .slice(0, 2);
  const overflowStatuses = game.reminders
    .filter(({ toPlayer }) => toPlayer === player)
    .slice(2);
  const showOverflowStates = overflowStatuses.length > 1;
  const statusesToRender = showOverflowStates
    ? baseStatuses
    : [...baseStatuses, ...overflowStatuses];

  return (
    <>
      {statusesToRender.map((status, idx) => (
        <PlaceInCircle index={index} stepsIn={2 + idx / 2} key={status.id}>
          <PlayerList.Actions player={player}>
            {/* We need to add pointer events manually to prevent the div from overlapping us, because corners bullshit */}
            <button className="pointer-events-auto rounded-full bg-green-600 p-1">
              {/* <PlayerStatusIcon
                statusType={status.archetype}
                size="24"
                color="white"
              /> */}
            </button>
          </PlayerList.Actions>
        </PlaceInCircle>
      ))}
      {showOverflowStates && (
        <PlaceInCircle index={index} stepsIn={2 + baseStatuses.length / 2}>
          <PlayerList.Actions player={player}>
            <button className="pointer-events-auto rounded-full bg-purple-600 p-1">
              <FaEllipsis size="24" color="white" />
            </button>
          </PlayerList.Actions>
        </PlaceInCircle>
      )}
      <PlaceInCircle index={index} stepsIn={2 + baseStatuses.length / 2 + 1}>
        <AddPlayerReminder player={player}>
          <button className="pointer-events-auto rounded-full bg-purple-600 p-1">
            +
          </button>
        </AddPlayerReminder>
      </PlaceInCircle>
      <PlaceInCircle key={player} index={index} stepsIn={1}>
        <div className="z-10 h-full w-full p-2">
          <PlayerList.Actions player={player}>
            <button className="pointer-events-auto h-full w-full">
              <div
                data-testid={`tile_${player}`}
                ref={ref}
                className={classNames(
                  scalingTextclass,
                  "h-full w-full group relative flex flex-col p-2 hover:z-30 bg-violet-500 bg-opacity-70 rounded-full justify-around items-center",
                  {
                    "outline outline-8 outline-green-600":
                      game.deadPlayers[player] && !game.deadVotes[player],
                    "opacity-30 hover:opacity-100": game.deadPlayers[player],
                  },
                )}
              >
                <>
                  <RoleText
                    role={role}
                    className="line-clamp-2 hidden w-full break-all align-middle group-hover:inline"
                  />
                  <img
                    className="mx-auto block aspect-[15/9] flex-1 bg-cover object-cover object-[0_30%] group-hover:hidden"
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
                    "group-hover:hidden",
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
