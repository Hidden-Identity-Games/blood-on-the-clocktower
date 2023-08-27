import { Table } from "@radix-ui/themes";
import { PlayerSet } from "./store/Game";

interface PlayerRoleMapProps {
  players: PlayerSet | null;
  roles: Record<string, string> | null;
}

function PlayerRoleMap({ players, roles }: PlayerRoleMapProps) {
  return players ? (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Player</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Object.entries(roles ?? {}).map(([name, roleDesc]) => (
          <Table.Row key={name}>
            <Table.Cell>{players[name]}</Table.Cell>
            <Table.Cell>{roleDesc}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ) : (
    <div>Loading...</div>
  );
}

export default PlayerRoleMap;
