import { Flex, Grid, Heading, Text } from "@radix-ui/themes";
import tokenBack from "../../assets/token_logo.png";
import { usePlayer } from "../../store/usePlayer";
import { useTakeRole } from "../../store/actions/playerActions";
import classNames from "classnames";
import { useDefiniteGame } from "../../store/GameContext";
import React from "react";

export function PlayerRoleSelect() {
  const { game } = useDefiniteGame();
  const [player] = usePlayer();
  const [, , , takeRole] = useTakeRole();
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
  if (game.travelers[player!]) {
    return <Text>Please wait for the GM to assign you a role</Text>;
  }

  return (
    <Flex
      className="h-full w-full p-1"
      direction="column"
      align="center"
      justify="center"
      gap="5"
    >
      <Heading>Select a Role</Heading>
      <Grid columns="3" gap="3" width="auto" align="center" justify="center">
        {Object.entries(game.roleBag ?? {}).map(([roleNum, role], idx) => (
          <button
            key={idx}
            className={classNames(!role && "opacity-40")}
            disabled={!role}
            onClick={() => {
              takeRole(player!, parseInt(roleNum));
            }}
            aria-label={`Role number ${roleNum}`}
          >
            <Heading className="absolute z-10">{idx + 1}</Heading>
            <img className={rotationMap[rotations[idx]]} src={tokenBack} />
          </button>
        ))}
      </Grid>
    </Flex>
  );
}
