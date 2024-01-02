import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { getReminder } from "@hidden-identity/shared";
import { AlertCircleIcon, ShieldHalfIcon, SkullIcon } from "lucide-react";
import { useMemo } from "react";

import { PlayerNameWithRoleIcon } from "../../../../shared/RoleIcon";
import { useDecideFate } from "../../../../store/actions/gmPlayerActions";
import { useDefiniteGame } from "../../../../store/GameContext";

export function KillAction() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Kill/Revive players</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header className="w-full text-center">
          Kill/Revive players
        </Dialog.Header>
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
  const playerIsProtected = (player: string) =>
    game.reminders
      .filter(({ active, toPlayer }) => !!active && toPlayer === player)
      .some((status) => getReminder(status.name).type === "protected");
  const playerHasTriggerOnDeath = (player: string) =>
    game.reminders
      .filter(({ active, toPlayer }) => !!active && toPlayer === player)
      .some((status) => getReminder(status.name).type === "triggerOnDeath");

  // don't change the ordering when statuses change
  const frozenPlayerList = useMemo(() => {
    return [...game.playerList].sort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <Dialog.Close key="cancel" asChild>
        <Button className="capitalize" color="lime">
          {"Done"}
        </Button>
      </Dialog.Close>
      {frozenPlayerList.map((player) => (
        <Button
          key={player}
          className="flex gap-3 capitalize"
          color="violet"
          variant={playerIsDead(player) ? "soft" : "outline"}
          onClick={() => {
            void setPlayerFate(player, !playerIsDead(player));
          }}
        >
          <PlayerNameWithRoleIcon player={player} />
          <div className="flex justify-around">
            {playerIsDead(player) && <SkullIcon height="1em" />}
            {playerIsProtected(player) && <ShieldHalfIcon height="1em" />}
            {playerHasTriggerOnDeath(player) && (
              <AlertCircleIcon height="1em" />
            )}
          </div>
        </Button>
      ))}
    </div>
  );
}
