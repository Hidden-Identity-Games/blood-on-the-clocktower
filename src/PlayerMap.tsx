import { Table } from "@radix-ui/themes";
import { Character } from "./types/script";

interface PlayerMapProps {
  playersAndCharacters: Record<string, Character>;
}

function PlayerMap(props: PlayerMapProps) {
  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Player</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Object.entries(props.playersAndCharacters).map(([name, role]) => (
          <Table.Row key={name}>
            <Table.Cell>{name}</Table.Cell>
            <Table.Cell>{role.name}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

export default PlayerMap;
