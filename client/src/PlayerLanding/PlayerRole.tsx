import { Grid } from "@radix-ui/themes";
// import tokenBack from "../assets/token_logo.png";
import tokenBlank from "../assets/token_blank.png";
import { getCharacter } from "../assets/game_data/gameData";
import { Role } from "@hidden-identity/server";
// import { AlignmentText } from "../shared/RoleIcon";
import { usePlayer } from "../store/secretKey";
import { useDefiniteGame } from "../store/GameContext";
import { useAssignRole } from "../store/actions/gmPlayerActions";
import { useTakeRole } from "../store/actions/playerActions";
import classNames from "classnames";

export function PlayerRole() {
  const { game } = useDefiniteGame();
  const [player] = usePlayer();
  const [, isSetRoleLoading, , setRole] = useAssignRole();
  const [, , , takeRole] = useTakeRole();

  return (
    <>
      <Grid columns="3" gap="3" width="auto">
        {Object.entries(game.roleBag).map(([role, taken]) => (
          <button
            key={role}
            disabled={taken || isSetRoleLoading}
            onClick={() => {
              takeRole(role as Role);
              setRole(player!, role as Role);
            }}
          >
            <img
              className={classNames(taken && "opacity-50")}
              src={tokenBlank}
            />
          </button>
        ))}
      </Grid>
      {game.playersToRoles[player!] && (
        <img src={getCharacter(game.playersToRoles[player!]).imageSrc} />
      )}
    </>
  );
}
