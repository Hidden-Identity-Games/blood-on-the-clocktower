import { Button, Flex, Grid } from "@radix-ui/themes";
import React from "react";
import { usePlayerNamesToRoles } from "../store/useStore";
import "./OrderPlayers.css";

interface OrderPlayersProps {
  myName: string;
}

export function OrderPlayers({ myName }: OrderPlayersProps) {
  const players = Object.values(usePlayerNamesToRoles())
    .map(({ name }) => name)
    .filter((name) => name !== myName);
  const [neighbors, setNeighbors] = React.useState<string[]>(["", ""]);

  React.useEffect(() => {
    const timer = setInterval(() => console.log("hi"), 5000);

    return () => {
      clearInterval(timer);
    };
  }, [neighbors]);

  return (
    <Flex direction="column" align="center" gap="4">
      <Grid columns={"3"} gap="2">
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
