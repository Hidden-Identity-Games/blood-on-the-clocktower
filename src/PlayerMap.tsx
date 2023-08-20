import { Button, Table } from "@radix-ui/themes";
import { useRoles, useDistributeRoles } from "./store/useStore";

interface PlayerMapProps {}

function PlayerMap(props: PlayerMapProps) {
  const players = useRoles("test-game");
  const distributeRoles = useDistributeRoles("test-game");
  return players ? (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Player</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.entries(players).map(([name, roleDesc]) => (
            <Table.Row key={name}>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{roleDesc}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Button onClick={() => distributeRoles()}>Distribute Roles</Button>
    </>
  ) : (
    <div>Loading</div>
  );
}

export default PlayerMap;
