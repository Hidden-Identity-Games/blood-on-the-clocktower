import {
  Button,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { useDefiniteGame } from "../../store/GameContext";
import { DialogHeader } from "../../shared/DialogHeader";
import { UnifiedGame, WellOrderedPlayers } from "@hidden-identity/shared";
import { useState } from "react";
import { PlayerNameButton } from "../../shared/PlayerNameButton";
import classNames from "classnames";
import { ArrowLeftIcon, ClipboardCopyIcon } from "@radix-ui/react-icons";

interface ExportButtonProps {
  disabled?: boolean;
  className?: string;
}
export function ExportButton({
  disabled = false,
  className,
}: ExportButtonProps) {
  const { game } = useDefiniteGame();
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button disabled={disabled} className={className}>
          Export to Townsquare
        </Button>
      </Dialog.Trigger>

      <Dialog.Content className="m-2">
        <DialogHeader>Export to town square</DialogHeader>
        {game.orderedPlayers.problems ? (
          <ProblemsPanel />
        ) : (
          <ExportButtonContent />
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}

function createContent(players: string[], game: UnifiedGame) {
  return JSON.stringify(
    {
      bluffs: [],
      edition: {},
      roles: "",
      fabled: [],
      players: players.map((player) => ({
        name: player,
        id: "",
        role: game.playersToRoles[player]?.replace("_", ""),
        reminders: [],
        isVoteless: false,
        isDead: false,
        pronouns: "",
      })),
    },
    null,
    4,
  );
}
function ExportButtonContent() {
  const { game } = useDefiniteGame();
  const players = (game.orderedPlayers as WellOrderedPlayers).fullList;
  const [circleTopPlayer, _setCircleTopPlayer] = useState<string | null>(null);
  const [content, setContent] = useState(createContent(players, game));
  const setCircleTopPlayer = (player: string | null) => {
    _setCircleTopPlayer(player);
    const reversedPlayers = [...players].reverse();
    const playerIndex =
      player && reversedPlayers.includes(player)
        ? reversedPlayers.indexOf(player)
        : 0;

    const playersInOrder = [
      ...reversedPlayers.slice(playerIndex),
      ...reversedPlayers.slice(0, playerIndex),
    ];
    setContent(createContent(playersInOrder, game));
  };

  const [showSnackbar, setShowSnackbar] = useState(false);
  if (!circleTopPlayer) {
    return (
      <Flex gap="2" direction="column" className="overflow-y-auto">
        <Text>Please select the player you want at the top of the circle.</Text>
        {players.map((player) => (
          <PlayerNameButton
            key="player"
            onClick={() => setCircleTopPlayer(player)}
          >
            {player}
          </PlayerNameButton>
        ))}
      </Flex>
    );
  }

  return (
    <Flex gap="2" direction="column">
      <TextArea
        className="h-[400px]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></TextArea>

      {
        <div className={classNames(showSnackbar ? "opacity-100" : "opacity-0")}>
          Copied to clipboard
        </div>
      }
      <Flex justify="between">
        <IconButton
          variant="ghost"
          radius="full"
          onClick={() => setCircleTopPlayer(null)}
        >
          <ArrowLeftIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            navigator.clipboard.writeText(content);
            setShowSnackbar(true);
          }}
        >
          <ClipboardCopyIcon />
        </IconButton>
      </Flex>
    </Flex>
  );
}

export function ProblemsPanel() {
  const { game } = useDefiniteGame();
  if (!game.orderedPlayers.problems) {
    throw new Error("No errors");
  }
  return (
    <Flex direction="column" gap="2">
      <Heading>
        There's some problems in player order preventing export. We're waiting
        on these players to fix problems.
      </Heading>
      {Object.keys(game.orderedPlayers.playerProblems).map((player) => (
        <Text key="name" as="div" className="capitalize">
          {player}
        </Text>
      ))}
    </Flex>
  );
}
