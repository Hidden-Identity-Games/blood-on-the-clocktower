import { Role, getCharacter } from "@hidden-identity/shared";
import { RoleText, getRoleIcon } from "./RoleIcon";
import { useDefiniteGame } from "../store/GameContext";
import { PlayerStatusIcon } from "../GamemasterInGame/NotesIcons";
import classNames from "classnames";
import useResizeObserver from "use-resize-observer";

interface RoleTokenProps {
  role: Role;
  player: string;
  isHiddenView: boolean;
}

function is(num: number) {
  return {
    inBounds: (lower: number, upper: number = Number.POSITIVE_INFINITY) => {
      return num > lower && num <= upper;
    },
  };
}
export function RoleToken({ role, player, isHiddenView }: RoleTokenProps) {
  const { game } = useDefiniteGame();
  const { height = 0, ref } = useResizeObserver();
  return (
    <div
      ref={ref}
      className={classNames(
        "h-full w-full group relative flex flex-col p-2 hover:z-30 bg-violet-500 bg-opacity-70 rounded-full align-middle justify-between",
        {
          "outline outline-8 outline-green-600":
            game.deadPlayers[player] && !game.deadVotes[player],
          "opacity-30 hover:opacity-100": game.deadPlayers[player],
          "text-3xl": is(height).inBounds(150),
          "text-2xl": is(height).inBounds(125, 150),
          "text-xl": is(height).inBounds(100, 125),
          "text-base": is(height).inBounds(75, 100),
          "text-sm": is(height).inBounds(50, 75),
          "text-xs": is(height).inBounds(0, 50),
        },
      )}
    >
      {!isHiddenView && (
        <>
          <div className="mx-auto hidden max-w-full flex-1 break-words group-hover:block">
            <RoleText role={role} />
          </div>
          <img
            className="mx-auto block aspect-[15/9] flex-1 bg-cover object-cover object-[0_30%] group-hover:hidden"
            src={getRoleIcon(getCharacter(role))}
          />
        </>
      )}

      {!isHiddenView && (
        <div className="absolute inset-x-0 top-0 flex h-[33%] w-full justify-around text-sm">
          {game.playerPlayerStatuses[player]?.slice(0, 3).map((status) => (
            <div className="rounded-full bg-lime-700 bg-opacity-[75%] p-[6px]">
              <PlayerStatusIcon statusType={status.type} size={"100%"} />
            </div>
          ))}
        </div>
      )}

      <div
        className={classNames(
          "line-clamp-1 truncate capitalize bg-transparent w-[100%] ",
          {
            "line-through": game.deadPlayers[player],
            "my-auto": isHiddenView,
            // a temporary hack, the image and role text are not the same size, and I can't fix why
            "group-hover:opacity-0": true,
          },
        )}
      >
        {player}
      </div>
      {isHiddenView && game.onTheBlock[player] > 0 && (
        <div>Votes: {game.onTheBlock[player]}</div>
      )}
    </div>
  );
}
