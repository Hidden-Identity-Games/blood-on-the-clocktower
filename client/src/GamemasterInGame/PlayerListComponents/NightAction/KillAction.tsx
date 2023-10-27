import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useDefiniteGame } from "../../../store/GameContext";
import { useMemo } from "react";
import { PlayerNameWithRoleIcon } from "../../../shared/RoleIcon";
import { useDecideFate } from "../../../store/actions/gmPlayerActions";
import { GiChewedSkull } from "react-icons/gi";

export function KillAction() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Kill/Revive players</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <PlayerActionSelect />
      </Dialog.Content>
    </Dialog.Root>
  );
}

interface PlayerActionSelect {}
function PlayerActionSelect(_props: PlayerActionSelect) {
  const { game } = useDefiniteGame();
  const [, , , setPlayerFate] = useDecideFate();
  const playerIsDead = (player: string) => game.deadPlayers[player];

  // don't change the ordering when statuses change
  const frozenPlayerList = useMemo(() => {
    return [...game.playerList].sort();
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
          variant={playerIsDead(player) ? "soft" : "outline"}
          onClick={() => {
            setPlayerFate(player, !playerIsDead(player));
          }}
        >
          <PlayerNameWithRoleIcon player={player} />
          {playerIsDead(player) && <GiChewedSkull />}
        </Button>
      ))}
    </Flex>
  );
}
