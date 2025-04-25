import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { getCharacter, type UnifiedGame } from "@hidden-identity/shared";
import { SkullIcon } from "lucide-react";
import { FaFeather, FaGear } from "react-icons/fa6";
import { GiRaiseZombie } from "react-icons/gi";
import { LiaVoteYeaSolid } from "react-icons/lia";
import { PiKnifeBold } from "react-icons/pi";

import { AddReminder } from "../../../shared/Reminders/AddReminder";
import { CharacterName } from "../../../shared/RoleIcon";
import { useDeadVote } from "../../../store/actions/gmActions";
import {
  useAssignPlayerAlignment,
  useAssignRole,
  useDecideFate,
} from "../../../store/actions/gmPlayerActions";
import { useKickPlayer } from "../../../store/actions/playerActions";
import { useDefiniteGame } from "../../../store/GameContext";
import { useGetPlayerAlignment } from "../../../store/useStore";
import { RemindersList } from "../RemindersList";
import { PlayerList } from ".";
import { PlayerName } from "./PlayerName";
import { AlignmentSelect, RoleSelect } from "./Selectors";

export function PlayerActions({
  player,
  children,
}: {
  player: string;
  children: React.ReactNode;
}) {
  const { game } = useDefiniteGame();

  const [, decideFateLoading, , handleDecideFate] = useDecideFate();
  const [, deadVoteLoading, , setDeadVote] = useDeadVote();
  const [, , , kickPlayer] = useKickPlayer();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content className="m-2">
        <div className="flex flex-col gap-2 py-2">
          <div className="flex items-center justify-center pb-2">
            {game.deadPlayers[player] && <SkullIcon height="1em" />}
            <div className="mx-3 flex items-center gap-2 text-3xl font-bold">
              <PlayerName player={player} className="flex-1" />
              <RemindersList className="h-8" player={player} clearOnClick />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-[2]">
              <RoleChangeMenuItem game={game} player={player} />
            </div>

            <div className="flex-1">
              <AlignmentChangeMenuItem player={player} />
            </div>
          </div>
        </div>
        <div className="p-2 pb-4 text-xl">
          {getCharacter(game.playersToRoles[player]).ability}
        </div>

        <div className="flex flex-col gap-3">
          <AddReminder player={player}>
            <PlayerList.MenuItem
              onClick={() => {}}
              id={`${player}-add-reminder`}
              label="Add Reminder"
            >
              <FaGear />
            </PlayerList.MenuItem>
          </AddReminder>
          <PlayerList.MenuItem
            onClick={() =>
              void handleDecideFate(player, !game.deadPlayers[player])
            }
            disabled={decideFateLoading}
            id={`${player}-toggle-dead`}
            label={game.deadPlayers[player] ? "Revive" : "Kill"}
          >
            {game.deadPlayers[player] ? <GiRaiseZombie /> : <PiKnifeBold />}
          </PlayerList.MenuItem>
          <PlayerList.MenuItem
            id={`${player}-toggle-dead-vote`}
            label={
              game.deadVotes[player] ? "Return Dead Vote" : "Use Dead Vote"
            }
            onClick={() => void setDeadVote(player, !game.deadVotes[player])}
            disabled={deadVoteLoading}
          >
            <LiaVoteYeaSolid />
          </PlayerList.MenuItem>
          {game.travelers[player] && (
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button>Kick Traveler</Button>
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Header>Kick {player}?</Dialog.Header>
                <Dialog.Description>Are you sure?</Dialog.Description>
                <Dialog.Footer>
                  <Dialog.Close asChild>
                    <Button onClick={() => void kickPlayer(player)}>
                      Kick {player}
                    </Button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <Button>Cancel</Button>
                  </Dialog.Close>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Root>
          )}
          <PlayerList.NoteInputModal player={player}>
            {game.playerNotes[player] ? (
              <button className="text-left">
                <div className="flex items-center gap-4">
                  <Button className="rounded-full p-[14px]" variant="outline">
                    <FaFeather />
                  </Button>
                  <div className="text-xl">Notes:</div>
                </div>
                {game.playerNotes[player].split("\n").map((note, idx) => (
                  <div className="pl-[80px]" key={`note-${idx}`}>
                    {note}
                  </div>
                ))}
              </button>
            ) : (
              <PlayerList.MenuItem id={`${player}-notes`} label="Notes">
                <FaFeather />
              </PlayerList.MenuItem>
            )}
          </PlayerList.NoteInputModal>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function RoleChangeMenuItem({
  game,
  player,
}: {
  game: UnifiedGame;
  player: string;
}) {
  const [, , , setPlayerRole] = useAssignRole();

  return (
    <RoleSelect
      removable={false}
      traveler={game.travelers[player]}
      currentRole={game.playersToRoles[player]}
      onSelect={(next) => next && void setPlayerRole(player, next)}
    >
      <CharacterName role={game.playersToRoles[player]} size="3" />
    </RoleSelect>
  );
}
function AlignmentChangeMenuItem({ player }: { player: string }) {
  const getPlayerAlignment = useGetPlayerAlignment();
  const [, , , setPlayerAlignment] = useAssignPlayerAlignment();

  return (
    <AlignmentSelect
      player={player}
      currentAlignment={getPlayerAlignment(player)}
      onSelect={(next) => next && void setPlayerAlignment(player, next)}
    />
  );
}
