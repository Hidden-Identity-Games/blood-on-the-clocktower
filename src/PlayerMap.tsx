import { Callout, Table } from "@radix-ui/themes";
import {
  useRoles,
  useDistributeRoles,
  usePlayers,
  useAvailableRoles,
} from "./store/useStore";
import ConfirmButton from "./ConfirmButton";

function PlayerMap() {
  const availableRoles = useAvailableRoles("test-game");
  const players = usePlayers("test-game");
  const assignedRoles = useRoles("test-game");
  const distributeRoles = useDistributeRoles("test-game");

  return players ? (
    <>
      {Object.entries(players).length > availableRoles?.roles.length && (
        <Callout.Root>
          <Callout.Text>
            More players have joined this game then there are available roles.
          </Callout.Text>
        </Callout.Root>
      )}

      {Object.entries(players).length < availableRoles?.roles.length && (
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
          {Object.entries(assignedRoles).map(([name, roleDesc]) => (
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
