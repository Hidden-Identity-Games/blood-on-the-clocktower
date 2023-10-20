import { Flex, Grid, Heading } from "@radix-ui/themes";
import tokenBack from "../assets/token_logo.png";
import { Role } from "@hidden-identity/server";
import { usePlayer } from "../store/secretKey";
import { useTakeRole } from "../store/actions/playerActions";
import classNames from "classnames";
import { useDefiniteGame } from "../store/GameContext";
import React from "react";

export function PlayerRoleSelect() {
  const { game } = useDefiniteGame();
  const [player] = usePlayer();
  const [, , , takeRole] = useTakeRole();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const roleBagOnMount = React.useMemo(() => game.roleBag, []);
  const rotations = React.useMemo(() => {
    return Array.from({ length: 15 }).map(() => Math.floor(Math.random() * 11));
  }, []);
  const rotationMap: Record<number, string> = {
    0: "rotate-0",
    1: "rotate-1",
    2: "rotate-2",
    3: "rotate-3",
    4: "rotate-6",
    5: "rotate-12",
    6: "-rotate-1",
    7: "-rotate-2",
    8: "-rotate-3",
    9: "-rotate-6",
    10: "-rotate-12",
  };

  return (
    <Flex
      className="h-full w-full"
      direction="column"
      align="center"
      justify="center"
      gap="5"
    >
      <Heading>Select a Role</Heading>
      <Grid columns="3" gap="3" width="auto" align="center" justify="center">
        {Object.entries(game.roleBag).flatMap(([role, qtyLeft], roleIdx) =>
          Array.from({ length: roleBagOnMount[role as Role] }).map(
            (_, qtyIdx) => (
              <button
                className={classNames(qtyLeft <= qtyIdx && "opacity-40")}
                disabled={qtyLeft <= qtyIdx}
                onClick={() => {
                  takeRole(player!, role as Role);
                }}
              >
                <Heading className="absolute z-10">
                  {roleIdx + qtyIdx + 1}
                </Heading>
                <img
                  className={rotationMap[rotations[roleIdx + qtyIdx]]}
                  src={tokenBack}
                />
              </button>
            ),
          ),
        )}
      </Grid>
    </Flex>
  );
}
