import { Dialog, Flex, IconButton } from "@radix-ui/themes";
import { GiRaiseZombie } from "react-icons/gi";
import {
  useAssignPlayerAlignment,
  useAssignRole,
  useDeadVote,
  useDecideFate,
  useGetPlayerAlignment,
  usePlayerStatuses,
} from "../../store/useStore";
import { RxHamburgerMenu } from "react-icons/rx";
import { useDefiniteGame } from "../../store/GameContext";
import { PiKnifeBold } from "react-icons/pi";
import { LiaVoteYeaSolid } from "react-icons/lia";
import { PlayerList } from ".";
import { AlignmentSelect, RoleSelect } from "./Selectors";
import { UnifiedGame } from "@hidden-identity/server";
import { v4 } from "uuid";
import { PlayerStatusIcon } from "../NotesIcons";

export function PlayerActions({ player }: { player: string }) {
  const { game } = useDefiniteGame();
  const [, decideFateLoading, , handleDecideFate] = useDecideFate();
  const [, deadVoteLoading, , setDeadVote] = useDeadVote();
  const [, playerStatusesLoading, , setPlayerStatus] = usePlayerStatuses();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton id={`${player}-menu-btn`} variant="ghost">
          <RxHamburgerMenu />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content className="m-2">
        <Flex direction="column" gap="2">
          <PlayerList.MenuItem
            id={`${player}-toggle-dead`}
            label={game.deadPlayers[player] ? "Revive" : "Kill"}
          >
            <Dialog.Close>
              <IconButton
                onClick={() =>
                  handleDecideFate(player, !game.deadPlayers[player])
                }
                disabled={decideFateLoading}
              >
                {game.deadPlayers[player] ? <GiRaiseZombie /> : <PiKnifeBold />}
              </IconButton>
            </Dialog.Close>
          </PlayerList.MenuItem>
          <PlayerList.MenuItem id={`${player}-set-poison`} label="Poisoned">
            <Dialog.Close>
              <IconButton
                onClick={() =>
                  setPlayerStatus(player, "add", {
                    type: "poison",
                    id: v4(),
                  })
                }
                disabled={playerStatusesLoading}
              >
                <PlayerStatusIcon statusType="poison" />
              </IconButton>
            </Dialog.Close>
          </PlayerList.MenuItem>
          <PlayerList.MenuItem id={`${player}-set-drunk`} label="Drunk">
            <Dialog.Close>
              <IconButton
                onClick={() =>
                  setPlayerStatus(player, "add", {
                    type: "drunk",
                    id: v4(),
                  })
                }
                disabled={playerStatusesLoading}
              >
                <PlayerStatusIcon statusType="drunk" />
              </IconButton>
            </Dialog.Close>
          </PlayerList.MenuItem>
          {game.deadVotes[player] && (
            <PlayerList.MenuItem
              id={`${player}-return-dead-vote`}
              label="Return Dead Vote"
            >
              <Dialog.Close>
                <IconButton
                  onClick={() => setDeadVote(player, false)}
                  disabled={deadVoteLoading}
                >
                  <LiaVoteYeaSolid />
                </IconButton>
              </Dialog.Close>
            </PlayerList.MenuItem>
          )}
          <RoleChangeMenuItem game={game} player={player} />
          <AlignmentChangeMenuItem player={player} />
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
      onSelect={(next) => next && setPlayerRole(player, next)}
    />
  );
}
function AlignmentChangeMenuItem({ player }: { player: string }) {
  const getPlayerAlignment = useGetPlayerAlignment();
  const [, , , setPlayerAlignment] = useAssignPlayerAlignment();

  return (
    <AlignmentSelect
      currentAlignment={getPlayerAlignment(player)}
      onSelect={(next) => next && setPlayerAlignment(player, next)}
    />
  );
}
