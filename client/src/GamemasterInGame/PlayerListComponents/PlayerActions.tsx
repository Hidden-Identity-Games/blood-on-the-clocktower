import { Dialog, Flex, IconButton, Separator, Text } from "@radix-ui/themes";
import {
  GiAngelOutfit,
  GiBullHorns,
  GiDominoMask,
  GiDrippingKnife,
  GiRaiseZombie,
} from "react-icons/gi";
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
import { LiaVoteYeaSolid } from "react-icons/lia";
import { PlayerList } from ".";
import { AlignmentSelect, RoleSelect } from "./Selectors";
import { UnifiedGame } from "@hidden-identity/server";
import { v4 } from "uuid";
import { PlayerStatusIcon, PlayerStatusIcons } from "../NotesIcons";
import { alignmentColorMap } from "../../shared/CharacterTypes";
import { CharacterName } from "../../shared/RoleIcon";
import classNames from "classnames";
import { BiSolidSkull } from "react-icons/bi";

export function PlayerActions({ player }: { player: string }) {
  const { game } = useDefiniteGame();
  const [, , , handleDecideFate] = useDecideFate();
  const [, , , setDeadVote] = useDeadVote();
  const [, , , setPlayerStatus] = usePlayerStatuses();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton id={`${player}-menu-btn`} variant="ghost">
          <RxHamburgerMenu />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content className="m-2">
        <Flex direction="column" gap="2">
          <Dialog.Title>
            <PlayerActionsMenuHeader game={game} player={player} />
          </Dialog.Title>
          <Separator size="4" />

          <PlayerList.MenuItem
            id={`${player}-toggle-dead`}
            label={game.deadPlayers[player] ? "Revive" : "Kill"}
          >
            <IconButton
              onClick={() =>
                handleDecideFate(player, !game.deadPlayers[player])
              }
            >
              {game.deadPlayers[player] ? (
                <GiRaiseZombie />
              ) : (
                <GiDrippingKnife />
              )}
            </IconButton>
          </PlayerList.MenuItem>
          <PlayerList.MenuItem id={`${player}-set-poison`} label="Poisoned">
            <IconButton
              onClick={() =>
                setPlayerStatus(player, "add", {
                  type: "poison",
                  id: v4(),
                })
              }
            >
              <PlayerStatusIcon statusType="poison" />
            </IconButton>
          </PlayerList.MenuItem>
          <PlayerList.MenuItem id={`${player}-set-drunk`} label="Drunk">
            <IconButton
              onClick={() =>
                setPlayerStatus(player, "add", {
                  type: "drunk",
                  id: v4(),
                })
              }
            >
              <PlayerStatusIcon statusType="drunk" />
            </IconButton>
          </PlayerList.MenuItem>
          {game.deadVotes[player] && (
            <PlayerList.MenuItem
              id={`${player}-return-dead-vote`}
              label="Return Dead Vote"
            >
              <IconButton onClick={() => setDeadVote(player, false)}>
                <LiaVoteYeaSolid />
              </IconButton>
            </PlayerList.MenuItem>
          )}
          <AlignmentChangeMenuItem player={player} />
          <RoleChangeMenuItem game={game} player={player} />
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function PlayerActionsMenuHeader({
  game,
  player,
}: {
  game: UnifiedGame;
  player: string;
}) {
  const getPlayerAlignment = useGetPlayerAlignment();
  const alignment = getPlayerAlignment(player);
  const role = game.playersToRoles[player];
  const isDead = game.deadPlayers[player];

  return (
    <Text color={alignmentColorMap[alignment]} asChild>
      <Flex className="w-full capitalize" justify="between">
        <Flex className="px-1" direction="column" gap="0">
          <Flex className="ml-[6px]" align="center" gap="4">
            <BiSolidSkull className={classNames(isDead || "opacity-0")} />
            <PlayerList.Name player={player} />
          </Flex>
          <CharacterName
            color={alignmentColorMap[alignment]}
            role={role}
            gap="3"
          />
        </Flex>
        <Flex gap="2">
          <PlayerStatusIcons player={player} />
        </Flex>
      </Flex>
    </Text>
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
  const role = game.playersToRoles[player];

  return (
    <RoleSelect
      traveler={game.travelers[player]}
      currentRole={role}
      onSelect={(next) => next && setPlayerRole(player, next)}
    >
      <PlayerList.MenuItem id={`${player}-role-select`} label="Change Role">
        <Dialog.Trigger>
          <IconButton>
            <GiDominoMask />
          </IconButton>
        </Dialog.Trigger>
      </PlayerList.MenuItem>
    </RoleSelect>
  );
}
function AlignmentChangeMenuItem({ player }: { player: string }) {
  const getPlayerAlignment = useGetPlayerAlignment();
  const [, , , setPlayerAlignment] = useAssignPlayerAlignment();
  const alignment = getPlayerAlignment(player);

  return (
    <AlignmentSelect
      currentAlignment={alignment}
      onSelect={(next) => next && setPlayerAlignment(player, next)}
    >
      <PlayerList.MenuItem
        id={`${player}-alignment-select`}
        label="Change Alignment"
      >
        <Dialog.Trigger>
          <IconButton>
            {alignment === "Good" ? <GiAngelOutfit /> : <GiBullHorns />}
          </IconButton>
        </Dialog.Trigger>
      </PlayerList.MenuItem>
    </AlignmentSelect>
  );
}
