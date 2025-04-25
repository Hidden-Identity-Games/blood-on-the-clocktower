import { getCharacter } from "@hidden-identity/shared";
import classNames from "classnames";
import React from "react";
import useResizeObserver from "use-resize-observer";

import { PlayerList } from "../../../GMRoute/GMShared/PlayerListComponents";
import { useDefiniteGame } from "../../../store/GameContext";
import { useGetPlayerAlignment } from "../../../store/useStore";
import { alignmentColorMap } from "../../CharacterTypes";
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
  const { ref: playerNameRef, width: playerNameWidth = 0 } =
    useResizeObserver();
  const scalingTextClassPlayerName = useScalingTextClassName(playerNameWidth);
  const role = game.playersToRoles[player];
  const activeQueueItem = game.actionQueue.find(
    (item) => item.status === "todo",
  );

  const getPlayerAlignment = useGetPlayerAlignment();

  return (
    <>
      <PlaceInCircle key={player} index={index} stepsIn={1}>
        <div className="z-10 h-full w-full p-2">
          <PlayerList.Actions player={player}>
            <button className="pointer-events-auto h-full w-full">
              <div
                data-testid={`tile_${player}`}
                ref={ref}
                className={classNames(
                  scalingTextclass,
                  "h-full w-full group flex flex-col p-1 hover:z-30  bg-opacity-70 relative rounded-full justify-around items-center hover:opacity-100",
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
                </>

                <div
                  ref={playerNameRef}
                  className={classNames(
                    "line-clamp-1 truncate capitalize bg-transparent w-[100%] min-h-1 mt-auto",
                    {
                      "line-through": game.deadPlayers[player],
                    },
                    scalingTextClassPlayerName,
                    // a temporary hack, the image and role text are not the same size, and I can't fix why
                  )}
                >
                  {player}
                </div>
                <div className="absolute flex h-full w-full flex-col p-1">
                  <img
                    className="mx-auto block aspect-[15/9] w-full flex-1 bg-cover object-cover object-[0_0%] p-1"
                    src={getRoleIcon(getCharacter(role))}
                  />
                </div>
              </div>
            </button>
          </PlayerList.Actions>
        </div>
      </PlaceInCircle>
    </>
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
            fontSize="1rem"
            {...props}
          >
            {children}
          </textPath>
        </text>
      </svg>
    </>
  );
}
