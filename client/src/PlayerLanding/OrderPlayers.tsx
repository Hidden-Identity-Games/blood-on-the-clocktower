import { Button, Flex, Heading } from "@radix-ui/themes";
import React from "react";
import { useOrderPlayer } from "../store/useStore";
import "./OrderPlayers.css";
import { useDefiniteGame } from "../store/GameContext";
import { useMe } from "../store/secretKey";

export function OrderPlayers() {
  const myName = useMe();
  const { game } = useDefiniteGame();
  const [neighbor, setNeighbor] = React.useState<string | null>(null);
  const [, , , handleOrderPlayer] = useOrderPlayer();

  return (
    <Flex direction="column" align="center" gap="4">
      {neighbor ? (
        <Heading>{neighbor} is on your right</Heading>
      ) : (
        <Heading>
          Please pick the player who is on your right. If they are not shown,
          please make sure they have joined so we can get the game going!
        </Heading>
      )}

      <Flex gap="2">
        {Object.keys(game.playersToRoles)
          .filter((name) => name !== myName)
          .sort()
          .map((player) => (
            <Button
              className="name-button"
              key={player}
              disabled={neighbor === player}
              onClick={() => {
                setNeighbor(player);
                handleOrderPlayer(myName, player);
              }}
            >
              {player}
            </Button>
          ))}
      </Flex>
    </Flex>
  );
}
