import {
  type PlayerStatus,
  type PlayerStatusType,
} from "@hidden-identity/shared";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useMemo } from "react";
import { v4 } from "uuid";

import { PlayerNameWithRoleIcon } from "../../../../shared/RoleIcon";
import { usePlayerStatuses } from "../../../../store/actions/gmPlayerActions";
import { useDefiniteGame } from "../../../../store/GameContext";
import { PlayerStatusIcon } from "../../../GMInGame/NotesIcons";

export function PoisonActon() {
  return <StatusAction status={{ type: "poison" }} />;
}
export function DrunkActon() {
  return <StatusAction status={{ type: "drunk" }} />;
}
export function ProtectedActon() {
  return <StatusAction status={{ type: "protected" }} />;
}
export function CharacterAbilityActon() {
  return <StatusAction status={{ type: "characterAbility" }} />;
}

export function StatusAction(props: { status: PlayerStatusType }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Add {props.status.type} status to players</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <PlayerActionSelect status={props.status} />
      </Dialog.Content>
    </Dialog.Root>
  );
}

interface PlayerActionSelect {
  status: PlayerStatusType;
}
function PlayerActionSelect({ status }: PlayerActionSelect) {
  const { game } = useDefiniteGame();
  const playerList = [...game.playerList].sort();
  const [, , , setPlayerStatus] = usePlayerStatuses();
  const playerHasStatus = (player: string) =>
    game.playerPlayerStatuses[player]?.find((s) => s.type === status.type);

  // don't change the ordering when statuses change
  const frozenPlayerList = useMemo(() => {
    const playersWithStatus = playerList.filter((p) => playerHasStatus(p));
    const playersWithOutStatus = playerList.filter((p) => !playerHasStatus(p));
    return [...playersWithStatus, ...playersWithOutStatus];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex direction="column" gap="1">
      <Dialog.Close key="cancel">
        <Button className="capitalize" size="3" variant="soft" color="lime">
          {"Done"}
        </Button>
      </Dialog.Close>
      {frozenPlayerList.map((player) => (
        <Button
          key={player}
          className="capitalize"
          size="3"
          color="violet"
          variant={playerHasStatus(player) ? "soft" : "outline"}
          onClick={() => {
            const currentStatus = playerHasStatus(player);
            if (currentStatus) {
              void setPlayerStatus(player, "remove", currentStatus);
            } else {
              void setPlayerStatus(player, "add", {
                ...status,
                id: v4(),
              } as PlayerStatus);
            }
          }}
        >
          <PlayerNameWithRoleIcon player={player} />
          {playerHasStatus(player) && (
            <PlayerStatusIcon statusType={status.type} />
          )}
        </Button>
      ))}
    </Flex>
  );
}