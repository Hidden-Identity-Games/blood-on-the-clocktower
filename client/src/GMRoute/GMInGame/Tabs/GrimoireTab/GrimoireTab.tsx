import { getCharacter } from "@hidden-identity/shared";
import { Flex, IconButton, Separator, Text } from "@radix-ui/themes";
import React from "react";
import { GiAxeInStump } from "react-icons/gi";
import { RxHamburgerMenu } from "react-icons/rx";

import { ExecutionInfo } from "../../../../shared/ExecutionInfo";
import {
  type PlayerFilter,
  PlayerListFilters,
  usePlayerFilters,
} from "../../../../shared/PlayerListFilters";
import {
  PlayerListOrder,
  type PlayerOrder,
  usePlayerOrder,
} from "../../../../shared/PlayerListOrder";
import { SetCountModal } from "../../../../shared/SetCount";
import { useVotesToExecute } from "../../../../store/actions/gmPlayerActions";
import { useDefiniteGame } from "../../../../store/GameContext";
import { useFirstSeat } from "../../../../store/url";
import { PlayerList } from "../../../GMShared/PlayerListComponents";
import { PlayerNotes } from "../../../GMShared/PlayerListComponents/PlayerNotes";
import { RemindersList } from "../../../GMShared/RemindersList";

interface GrimoireTabProps {
  selectedOrder: PlayerOrder;
  setSelectedOrder: (order: PlayerOrder) => void;
}
export function GrimoireTab({
  selectedOrder,
  setSelectedOrder,
}: GrimoireTabProps) {
  const { game } = useDefiniteGame();
  const [firstSeat] = useFirstSeat();
  const orderedPlayers = usePlayerOrder(selectedOrder, firstSeat);
  const allFilters = usePlayerFilters(orderedPlayers);
  const [selectedFilter, setSelectedFilter] =
    React.useState<PlayerFilter>("all");
  const filteredPlayers = allFilters[selectedFilter];
  const [, , , setVotesToExecute] = useVotesToExecute();

  return (
    <>
      {game.time.time === "day" && <ExecutionInfo />}
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
                <button className="flex flex-1 items-center gap-2 text-left">
                  <PlayerList.Name player={player} />
                  <RemindersList className="h-6" player={player} />
                </button>
              </PlayerList.NoteInputModal>
              <SetCountModal
                title="Votes cast"
                onSet={(votes: number) => void setVotesToExecute(player, votes)}
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
    </>
  );
}
