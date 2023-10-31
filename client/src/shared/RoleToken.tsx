import { Role, getCharacter } from "@hidden-identity/shared";
import tokenBlank from "../assets/token_blank.png";
import { getRoleIcon } from "./RoleIcon";
import "./roleToken.css";
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
      className={classNames(
        "roleWrapper relative flex h-full w-full flex-col pt-[10%] hover:z-30",
        { "opacity-50": game.deadPlayers[player] },
      )}
      style={{
        backgroundImage: `url(${tokenBlank})`,
        backgroundSize: "cover",
      }}
    >
      {!isDayView && (
        <img className="mx-auto w-4/5" src={getRoleIcon(getCharacter(role))} />
      )}
      {!isDayView && (
        <div className="absolute inset-x-0 top-0 flex h-[33%] w-full justify-around text-sm">
          {game.playerPlayerStatuses[player]?.slice(0, 3).map((status) => (
            <div className="rounded-full bg-gray-600 p-[6px] opacity-100">
              <PlayerStatusIcon statusType={status.type} size={"100%"} />
            </div>
          ))}
        </div>
      )}

      <div
        className={classNames(
          "playerInfo mt-[-25%] rounded  bg-violet-700 bg-opacity-[50%] p-1 pt-[4px] text-center text-base opacity-[75%]",
          {
            "absolute inset-0 mt-0 flex justify-center items-center bg-inherit text-white text-xl":
              isDayView,
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
  );
}
