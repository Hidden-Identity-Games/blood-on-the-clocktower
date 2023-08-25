import { Callout, Table } from "@radix-ui/themes";
import { useRoles, useDistributeRoles, usePlayers } from "./store/useStore";
import ConfirmButton from "./ConfirmButton";

function PlayerMap() {
  const roles = useRoles("test-game");
  const players = usePlayers("test-game");
  const distributeRoles = useDistributeRoles("test-game");

  return players ? (
    <>
      {Object.entries(players).length > Object.entries(roles).length && (
        <Callout.Root>
          <Callout.Text>Too many players.</Callout.Text>
        </Callout.Root>
      )}

      {Object.entries(players).length < Object.entries(roles).length && (
        <Callout.Root>
          <Callout.Text>Waiting for players...</Callout.Text>
        </Callout.Root>
      )}

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Player</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.entries(roles).map(([name, roleDesc]) => (
            <Table.Row key={name}>
              <Table.Cell>{players[name]}</Table.Cell>
              <Table.Cell>{roleDesc}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <ConfirmButton handleConfirm={() => distributeRoles()}>
        Distribute Roles
      </ConfirmButton>
    </>
  ) : (
    <div>Loading...</div>
  );
}

export default PlayerMap;
