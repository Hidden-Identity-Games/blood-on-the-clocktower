import React from "react";
import {
  PlayerFilter,
  PlayerListFilters,
  usePlayerFilters,
} from "../../shared/PlayerListFilters";
import {
  PlayerListOrder,
  PlayerOrder,
  usePlayerOrder,
} from "../../shared/PlayerListOrder";
import { useDefiniteGame } from "../../store/GameContext";
import { useFirstSeat } from "../../store/url";
import { useVotesToExecute } from "../../store/actions/gmPlayerActions";
import { Flex, IconButton, Separator, Text } from "@radix-ui/themes";
import { PlayerList } from "../PlayerListComponents";
import { getCharacter } from "@hidden-identity/shared";
import { DeadVoteIcon } from "../NotesIcons";
import { SetCountModal } from "../../shared/SetCount";
import { GiAxeInStump } from "react-icons/gi";
import { RxHamburgerMenu } from "react-icons/rx";
import { PlayerNotes } from "../PlayerListComponents/PlayerNotes";

interface IngamePlayerListProps {
  selectedOrder: PlayerOrder;
  setSelectedOrder: (order: PlayerOrder) => void;
}
export function IngamePlayerList({
  selectedOrder,
  setSelectedOrder,
}: IngamePlayerListProps) {
  const { game } = useDefiniteGame();
  const [firstSeat] = useFirstSeat();
  const orderedPlayers = usePlayerOrder(selectedOrder, firstSeat);
  const allFilters = usePlayerFilters(orderedPlayers);
  const [selectedFilter, setSelectedFilter] =
    React.useState<PlayerFilter>("all");
  const filteredPlayers = allFilters[selectedFilter];
  const [, , , setVotesToExecute] = useVotesToExecute();

  return (
    <Flex className="h-full overflow-y-auto" direction="column" p="2" gap="2">
      <PlayerListFilters
        allFilters={allFilters}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
      <PlayerListOrder
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
      />
      <Separator size="4" />
      {filteredPlayers.map((player) => (
        <Flex direction="column" key={player}>
          <Text size="4" asChild>
            <Flex justify="between" align="center" gap="3">
              <PlayerList.RoleIcon player={player}>
                {getCharacter(game.playersToRoles[player]).ability}
              </PlayerList.RoleIcon>
              <PlayerList.NoteInputModal player={player}>
                <button className="flex-1 text-left">
                  <PlayerList.Name player={player} />
                </button>
              </PlayerList.NoteInputModal>
              <DeadVoteIcon player={player} />
              <SetCountModal
                title="Set votes to execute:"
                onSet={(votes: number) => setVotesToExecute(player, votes)}
                defaultValue={game.onTheBlock[player] ?? 0}
              >
                <IconButton variant="soft" radius="large">
                  <GiAxeInStump />
                </IconButton>
              </SetCountModal>
              <PlayerList.Actions player={player}>
                <IconButton id={`${player}-menu-btn`} variant="ghost">
                  <RxHamburgerMenu />
                </IconButton>
              </PlayerList.Actions>
            </Flex>
          </Text>

          <PlayerNotes className="px-[3em] py-1" player={player} />
        </Flex>
      ))}
    </Flex>
  );
}
