import { PlaceInCircle } from ".";
import { useVotesToExecute } from "../../../store/actions/gmPlayerActions";
import { SetCountModal } from "../../SetCount";
import { useDefiniteGame } from "../../../store/GameContext";
import classNames from "classnames";
import { useScalingTextClassName } from "./ScalingText";
import useResizeObserver from "use-resize-observer";

export interface SpectatorTile {
  player: string;
  index: number;
}
export function SpectatorTile({ player, index }: SpectatorTile) {
  const { game } = useDefiniteGame();
  const [, , , setVotesToExecute] = useVotesToExecute();
  const { ref, width = 0 } = useResizeObserver();
  const scalingTextclass = useScalingTextClassName(width);
  return (
    <PlaceInCircle key={player} index={index} stepsIn={1}>
      <SetCountModal
        title="Votes to Execute:"
        onSet={(votes: number) => setVotesToExecute(player, votes)}
        defaultValue={game.onTheBlock[player] && 0}
      >
        <div className="h-full w-full p-2">
          <button
            ref={ref}
            className={classNames(
              scalingTextclass,
              "h-full w-full group relative flex flex-col p-1 hover:z-30 bg-violet-500 bg-opacity-70 rounded-full align-middle justify-between",
              {
                "outline outline-8 outline-green-600":
                  game.deadPlayers[player] && !game.deadVotes[player],
                "opacity-30 hover:opacity-100": game.deadPlayers[player],
              },
            )}
          >
            <div
              className={classNames(
                "line-clamp-1 truncate capitalize bg-transparent w-[100%] my-auto",
                {
                  "line-through": game.deadPlayers[player],
                },
              )}
            >
              {player}
            </div>
            {game.onTheBlock[player] > 0 && (
              <div>Votes: {game.onTheBlock[player]}</div>
            )}
          </button>
        </div>
      </SetCountModal>
    </PlaceInCircle>
  );
}
