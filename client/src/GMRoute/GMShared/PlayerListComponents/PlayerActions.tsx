import { type UnifiedGame } from "@hidden-identity/shared";
import { Dialog, Flex, Heading, IconButton, Text } from "@radix-ui/themes";
import { FaFeather, FaGear, FaSkull } from "react-icons/fa6";
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
import { useDefiniteGame } from "../../../store/GameContext";
import { useGetPlayerAlignment } from "../../../store/useStore";
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

  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content className="m-2">
        <Flex gap="2" direction="column" className="py-2 capitalize">
          <Flex className="justify-center pb-2" align="center">
            {game.deadPlayers[player] && <FaSkull />}
            <Heading className="mx-3">
              <PlayerName player={player} />
            </Heading>
          </Flex>
          <Flex gap="2">
            <div className="flex-[2]">
              <RoleChangeMenuItem game={game} player={player} />
            </div>

            <div className="flex-1">
              <AlignmentChangeMenuItem player={player} />
            </div>
          </Flex>
        </Flex>

        <Flex direction="column" gap="2">
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
          <PlayerList.NoteInputModal player={player}>
            {game.playerNotes[player] ? (
              <button className="text-left">
                <Flex gap="4" align="center">
                  <IconButton size="4" variant="soft" className="p-[14px]">
                    <FaFeather />
                  </IconButton>
                  <Text className="text-xl">Notes:</Text>
                </Flex>
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
        </Flex>
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
      currentAlignment={getPlayerAlignment(player)}
      onSelect={(next) => next && void setPlayerAlignment(player, next)}
    />
  );
}
