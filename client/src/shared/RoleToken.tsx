import { Role, getCharacter } from "@hidden-identity/shared";
import TokenBlank from "../assets/token_blank.png";
import { getRoleIcon } from "./RoleIcon";
import { useDefiniteGame } from "../store/GameContext";
import { PlayerStatusIcon } from "../GamemasterInGame/NotesIcons";
import classNames from "classnames";

interface RoleTokenProps {
  role: Role;
  player: string;
  isDayView: boolean;
}
export function RoleToken({ role, player, isDayView }: RoleTokenProps) {
  const { game } = useDefiniteGame();
  return (
    <div
      className={classNames("h-full w-full", {
        "outline outline-4 outline-red-600 rounded-full":
          game.deadVotes[player],
      })}
    >
      <div
        className={classNames(
          "group relative flex h-full w-full flex-col pt-[10%] hover:z-30",
          {
            "opacity-50 hover::opacity-100": game.deadPlayers[player],
          },
        )}
        style={{
          backgroundImage: `url(${TokenBlank})`,
          backgroundSize: "cover",
        }}
      >
        {!isDayView && (
          <img
            className="mx-auto w-4/5"
            src={getRoleIcon(getCharacter(role))}
          />
        )}
        {!isDayView && (
          <div className="absolute inset-x-0 top-0 flex h-[33%] w-full justify-around text-sm">
            {game.playerPlayerStatuses[player]?.slice(0, 3).map((status) => (
              <div className="rounded-full bg-lime-700 bg-opacity-[65%] p-[6px]">
                <PlayerStatusIcon statusType={status.type} size={"100%"} />
              </div>
            ))}
          </div>
        )}

        <div
          className={classNames(
            " mt-[-25%] rounded   text-center text-base opacity-[75%] group-hover:z-50 group-hover:opacity-100",
            {
              "absolute inset-0 mt-[2%] flex justify-center items-center bg-opacity-[0%] text-black text-2xl":
                isDayView,
              "bg-violet-700 bg-opacity-[50%] group-hover:bg-opacity-100 p-1 pt-[4px]":
                !isDayView,
            },
          )}
        >
          <div
            className={classNames("line-clamp-1 truncate capitalize", {
              "line-through": game.deadPlayers[player],
            })}
          >
            {player}
          </div>
        </div>
      </div>
    </div>
  );
}
