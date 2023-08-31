import { Box, Grid, Heading } from "@radix-ui/themes";
import { PlayerSet } from "../store/Game";

interface PlayerListProps {
  players: PlayerSet | null;
}

function PlayerList({ players }: PlayerListProps) {
  return (
    <>
      <Heading as="h2">Players</Heading>
      <Grid columns="2" gap="3" width="auto">
        {Object.entries(players ?? {}).map(([, name]) => (
          <Box>{name}</Box>
        ))}
      </Grid>
    </>
  );
}

export default PlayerList;
