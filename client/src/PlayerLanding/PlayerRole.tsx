import { Flex, Grid } from "@radix-ui/themes";
// import tokenBack from "../assets/token_logo.png";
import tokenBlank from "../assets/token_blank.png";
// import { getCharacter } from "../assets/game_data/gameData";
import { Role } from "@hidden-identity/server";
// import { AlignmentText } from "../shared/RoleIcon";
import { usePlayer } from "../store/secretKey";
import { useDefiniteGame } from "../store/GameContext";
import { useAssignRole } from "../store/actions/gmPlayerActions";
import { useTakeRole } from "../store/actions/playerActions";
import classNames from "classnames";
import { motion } from "framer-motion";

export function PlayerRole() {
  const { game } = useDefiniteGame();
  const [player] = usePlayer();
  const [, isSetRoleLoading, , setRole] = useAssignRole();
  const [, , , takeRole] = useTakeRole();

  return (
    <Flex className="h-full w-full" justify="center">
      <Grid columns="3" gap="3" width="auto">
        {Object.entries(game.roleBag).map(([role, taken]) => (
          <motion.div key={role}>
            <button
              className={classNames(
                taken &&
                  game.playersToRoles[player!] === "unassigned" &&
                  "opacity-40",
                ![role, "unassigned"].includes(game.playersToRoles[player!]) &&
                  "opacity-0",
              )}
              disabled={
                taken ||
                isSetRoleLoading ||
                game.playersToRoles[player!] !== "unassigned"
              }
              onClick={async () => {
                if (await takeRole(role as Role)) {
                  setRole(player!, role as Role);
                }
              }}
            >
              <img src={tokenBlank} />
            </button>
          </motion.div>
        ))}
      </Grid>
    </Flex>
  );
}
