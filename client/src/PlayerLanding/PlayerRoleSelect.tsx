import { Flex, Grid, Heading } from "@radix-ui/themes";
import tokenBack from "../assets/token_logo.png";
import { Role } from "@hidden-identity/server";
import { usePlayer } from "../store/secretKey";
import { useRoleSelect } from "../store/GameContext";
import { useAssignRole } from "../store/actions/gmPlayerActions";
import { useTakeRole } from "../store/actions/playerActions";
import classNames from "classnames";

export function PlayerRoleSelect() {
  const { roleSelect } = useRoleSelect();
  const [player] = usePlayer();
  const [, isSetRoleLoading, , setRole] = useAssignRole();
  const [, , , takeRole] = useTakeRole();

  return (
    <Flex className="h-full w-full" direction="column" justify="center">
      <Heading>Select a Role</Heading>
      <Grid columns="3" gap="3" width="auto">
        {Object.entries(roleSelect?.roleBag ?? {}).map(([role, taken]) => (
          <button
            className={classNames(taken && "opacity-40")}
            disabled={taken || isSetRoleLoading}
            onClick={async () => {
              if (await takeRole(role as Role)) {
                setRole(player!, role as Role);
              }
            }}
          >
            <img src={tokenBack} />
          </button>
        ))}
      </Grid>
    </Flex>
  );
}
