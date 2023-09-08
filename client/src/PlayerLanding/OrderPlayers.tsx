import { Button, Flex, Grid } from "@radix-ui/themes";
import React from "react";
import { usePlayerNamesToRoles } from "../store/useStore";
import "./OrderPlayers.css";

interface OrderPlayersProps {
  myName: string;
}

function OrderPlayers({ myName }: OrderPlayersProps) {
  const players = Object.values(usePlayerNamesToRoles())
    .map(({ name }) => name)
    .filter((name) => name !== myName);
  const [neighbors, setNeighbors] = React.useState<string[]>(["", ""]);

  return (
    <Flex direction="column" align="center" gap="3">
      <Grid columns={"3"} gap="1">
        {players.sort().map((pl) => (
          <Button
            className="name-button"
            key={pl}
            disabled={neighbors.includes(pl)}
            onClick={() =>
              setNeighbors((prevNeighbors) => [...prevNeighbors, pl].slice(1))
            }
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
        onClick={() =>
          setNeighbors((prevNeighbors) => [prevNeighbors[1], prevNeighbors[0]])
        }
      >
        Swap
      </Button>
    </Flex>
  );
}

export { OrderPlayers };
