import { Button, Flex, Grid } from "@radix-ui/themes";
import React from "react";
import { useOrderPlayer, usePlayerNamesToRoles } from "../store/useStore";
import "./OrderPlayers.css";

interface OrderPlayersProps {
  myName: string;
}

export function OrderPlayers({ myName }: OrderPlayersProps) {
  const players = Object.values(usePlayerNamesToRoles())
    .map(({ name }) => name)
    .filter((name) => name !== myName);
  const [neighbors, setNeighbors] = React.useState<string[]>(["", ""]);
  const [, , , handleOrderPlayer] = useOrderPlayer();

  return (
    <Flex direction="column" align="center" gap="4">
      <Grid columns={"3"} gap="2">
        {players.sort().map((pl) => (
          <Button
            className="name-button"
            key={pl}
            disabled={neighbors.includes(pl)}
            onClick={() => {
              const newNeighbors = [pl, ...neighbors].slice(0, 2);
              setNeighbors(newNeighbors);
              handleOrderPlayer(myName, newNeighbors[0], newNeighbors[1]);
            }}
          >
            {pl}
          </Button>
        ))}
      </Grid>

      <div className="name-button">
        {neighbors[0]}
        {" <= YOU => "}
        {neighbors[1]}
      </div>

      <Button
        variant="surface"
        onClick={() => {
          const newNeighbors = [neighbors[1], neighbors[0]];
          setNeighbors(newNeighbors);
          handleOrderPlayer(myName, newNeighbors[0], newNeighbors[1]);
        }}
      >
        Swap
      </Button>
    </Flex>
  );
}
