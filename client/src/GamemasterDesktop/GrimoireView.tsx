import { useParams } from "react-router-dom";
import {
  CircularLayout,
  PlaceInCenter,
  PlaceInCircle,
} from "../shared/CircularLayout";
import { useGame } from "../store/GameContext";
import { GameProvider } from "../store/GameContextProvider";
import { LoadingExperience } from "../shared/LoadingExperience";
import {
  Card,
  Flex,
  IconButton,
  Inset,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { RoleToken } from "../shared/RoleToken";
import { Role, getCharacter } from "@hidden-identity/shared";
import { usePlayerOrder } from "../shared/PlayerListOrder";
import React from "react";
import { AlignmentText, PlayerNameWithRoleIcon } from "../shared/RoleIcon";
import { PlayerStatusIcons } from "../GamemasterInGame/NotesIcons";
import classNames from "classnames";
import { GiFeather } from "react-icons/gi";
import { usePlayerNotes } from "../store/actions/gmPlayerActions";
import { FaArrowsRotate } from "react-icons/fa6";
import { PlayerActions } from "../GamemasterInGame/PlayerListComponents/PlayerActions";
// import { NightPlayerList } from "../GamemasterInGame/PlayerList";
// import { useSetGameStatus } from "../store/actions/gmActions";

export function GrimoireView() {
  const { gameId } = useParams();
  return (
    <GameProvider gameId={gameId!}>
      <Flex className="flex-1" justify="between">
        <Grimoire />
        {/* <NightOrder /> */}
      </Flex>
    </GameProvider>
  );
}

// function NightOrder() {
//   const { game } = useGame();
//   const [, , , setGameStatus] = useSetGameStatus();

//   if (!game) {
//     return <LoadingExperience>Loading</LoadingExperience>;
//   }

//   return (
//     <NightPlayerList
//       firstNight={game.gameStatus === "Setup"}
//       endNightCallback={() => {
//         if (game.gameStatus === "Setup") {
//           setGameStatus("Started");
//         }
//       }}
//       onOpenNote={() => {}}
//     />
//   );
// }

function Grimoire() {
  const { game } = useGame();
  const [activePlayer, setActivePlayer] = React.useState("");
  const [firstSeat, setFirstSeat] = React.useState("");
  const players = usePlayerOrder("seat order", firstSeat);

  if (!game) {
    return <LoadingExperience>Loading</LoadingExperience>;
  }

  return (
    <Flex
      pb="5"
      className="flex-1 overflow-y-hidden"
      align="center"
      justify="center"
      direction="column"
    >
      <CircularLayout className="aspect-square flex-1">
        <PlaceInCenter>
          <PlayerOptions player={activePlayer} setFirstSeat={setFirstSeat} />
        </PlaceInCenter>
        <>
          {players.map((player, idx) => (
            <PlaceInCircle
              key={player}
              index={idx}
              totalCountInCircle={players.length}
            >
              <RoleCard
                player={player}
                role={game.playersToRoles[player]}
                isFocused={activePlayer === player}
                onClick={() => setActivePlayer(player)}
              />
            </PlaceInCircle>
          ))}
        </>
      </CircularLayout>
    </Flex>
  );
}

interface RoleCardProps {
  player: string;
  role: Role;
  isFocused: boolean;
  onClick: () => void;
}
function RoleCard({ player, role, isFocused, onClick }: RoleCardProps) {
  const { game } = useGame();

  return (
    <Card
      className={classNames("hover:z-20", isFocused && "bg-yellow-500 z-10")}
      variant="ghost"
    >
      <Flex
        mt="2"
        className="absolute rounded bg-gray-900 bg-opacity-[85%]"
        direction="column"
      >
        <PlayerStatusIcons player={player} />
      </Flex>
      <button onClick={onClick}>
        <RoleToken role={role} />
        <Inset
          mt="-2"
          className="rounded-lg bg-violet-900 text-center"
          side="bottom"
        >
          <Text size="1">
            <Flex direction="column" align="center" gap="1">
              <Flex align="center" gap="1">
                <Text color="amber" asChild>
                  <GiFeather
                    className={!game?.playerNotes[player] && "opacity-0"}
                  />
                </Text>
                {player}
                <Text color="amber" asChild>
                  <GiFeather
                    className={!game?.playerNotes[player] && "opacity-0"}
                  />
                </Text>
              </Flex>
              <AlignmentText player={player}>
                {getCharacter(role).name}
              </AlignmentText>
            </Flex>
          </Text>
        </Inset>
      </button>
    </Card>
  );
}

interface PlayerOptionsProps {
  player: string;
  setFirstSeat: (player: string) => void;
}
function PlayerOptions({ player, setFirstSeat }: PlayerOptionsProps) {
  const { game } = useGame();
  const [, , , setNote] = usePlayerNotes();

  return (
    <Flex direction="column" justify="center" align="center" gap="2">
      <PlayerNameWithRoleIcon player={player} />
      <Flex gap="1">
        <PlayerStatusIcons player={player} />
      </Flex>
      <TextArea
        key={player}
        defaultValue={game?.playerNotes[player]}
        onBlur={(e) => setNote(player, e.currentTarget.value)}
      />
      <Flex align="center" justify="between" gap="3" asChild>
        <label>
          <PlayerActions player={player} />
          Player Actions
        </label>
      </Flex>
      <Flex align="center" gap="3" asChild>
        <label>
          <IconButton variant="ghost" onClick={() => setFirstSeat(player)}>
            <FaArrowsRotate />
          </IconButton>
          Move to Top of Ring
        </label>
      </Flex>
    </Flex>
  );
}
