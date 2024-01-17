import { Flex, Heading, Text } from "@radix-ui/themes";
import classNames from "classnames";
import React from "react";

import tokenBack from "../../assets/token_logo.png";
import { useTakeRole } from "../../store/actions/playerActions";
import { useDefiniteGame } from "../../store/GameContext";
import { usePlayer } from "../../store/usePlayer";

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
      className="w-full flex-1"
      direction="column"
      align="center"
      justify="center"
      gap="5"
    >
      <Heading>Select a Role</Heading>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {game.playerList
          .filter((player) => !game.travelers[player])
          .map((_, idx) => {
            const roleNum = idx + 1;
            const role = game.roleBag[roleNum];
            return (
              <button
                key={roleNum}
                className={classNames(!role && "opacity-40", "max-w-[25%]")}
                disabled={!role}
                onClick={() => {
                  void takeRole(player!, Number(roleNum));
                }}
                aria-label={`Role number ${roleNum}`}
              >
                <Heading className="absolute z-10">{roleNum}</Heading>
                <img className={rotationMap[rotations[idx]]} src={tokenBack} />
              </button>
            );
          })}
      </div>
    </Flex>
  );
}
