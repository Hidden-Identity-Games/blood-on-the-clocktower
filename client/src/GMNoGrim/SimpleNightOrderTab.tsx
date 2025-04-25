import { getCharacter, type Role } from "@hidden-identity/shared";
import classNames from "classnames";

import { PlayerName } from "../GMRoute/GMShared/PlayerListComponents/PlayerName";
import { RoleIcon, RoleName } from "../shared/RoleIcon";
import { useDefiniteGame } from "../store/GameContext";

export function SimpleNightOrderTab() {
  const { game } = useDefiniteGame();

  const { playerList, script, time } = game;
  const isFirstNight = time.count === 1;
  const nightIndex = isFirstNight ? "firstNight" : "otherNight";
  const scriptCharacters = script.map((char) => getCharacter(char.id));
  scriptCharacters.sort(
    (a, b) => (a[nightIndex]?.order ?? -1) - (b[nightIndex]?.order ?? -1),
  );
  function playersOfCharacter(role: Role) {
    return playerList.filter((p) => game.playersToRoles[p] === role);
  }

  return (
    <div className="flex flex-col gap-2">
      {scriptCharacters.map((char) => (
        <div
          className={classNames(
            "flex gap-1",
            playersOfCharacter(char.id).length === 0 && "opacity-25",
            playersOfCharacter(char.id).filter((p) => !game.deadPlayers[p])
              .length === 0 &&
              playersOfCharacter(char.id).length !== 0 &&
              "line-through opacity-50",
          )}
        >
          <RoleIcon role={char.id} className="mr-2 h-[2em]" />

          <span className="flex-1 text-left">{RoleName(char.id)}</span>
          <div className="mx-2 flex gap-1">
            {playersOfCharacter(char.id).map((p) => (
              <>
                <PlayerName player={p} className="" />
              </>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
