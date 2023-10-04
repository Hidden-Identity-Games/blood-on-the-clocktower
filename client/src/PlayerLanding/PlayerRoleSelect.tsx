import { Flex, Grid, Heading } from "@radix-ui/themes";
import tokenBack from "../assets/token_logo.png";
import { Role } from "@hidden-identity/server";
import { usePlayer } from "../store/secretKey";
import { useTakeRole } from "../store/actions/playerActions";
import classNames from "classnames";
import { useDefiniteGame } from "../store/GameContext";

export function PlayerRoleSelect() {
  const { game } = useDefiniteGame();
  const [player] = usePlayer();
  const [, , , takeRole] = useTakeRole();

  return (
    <Flex
      className="h-full w-full"
      direction="column"
      align="center"
      justify="center"
      gap="5"
    >
      <Heading>Select a Role</Heading>
      <Grid columns="3" gap="3" width="auto">
        {Object.entries(game.roleBag ?? {}).map(([role, taken]) => (
          <button
            className={classNames(taken && "opacity-40")}
            disabled={taken}
            onClick={() => {
              takeRole(player!, role as Role);
            }}
          >
            <img src={tokenBack} />
          </button>
        ))}
      </Grid>
    </Flex>
  );
}
