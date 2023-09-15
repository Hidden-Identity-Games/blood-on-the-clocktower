import { IoIosBeer } from "react-icons/io";
import { FaVial } from "react-icons/fa6";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { GiFeather } from "react-icons/gi";
import { LiaVoteYeaSolid } from "react-icons/lia";

import { BsFillPersonBadgeFill } from "react-icons/bs";

import { MeaningfulStatusIcon } from "../shared/MeaningfulIcon";
import { useDefiniteGame } from "../store/GameContext";
import { Button, Dialog, Flex, IconButton, Text } from "@radix-ui/themes";
import { Note } from "@hidden-identity/server";
import { useDeadVote, usePlayerNotes } from "../store/useStore";

function NotesIconList({
  notes,
  size,
  player,
}: {
  player: string;
  notes: (Note | { type: "adead-vote"; id: string })[];
  size: "1" | "2" | "3";
}) {
  const className = "h-2";

  const [, , , updatePlayerNote] = usePlayerNotes();

  return [...notes]
    .sort((a, b) => (a.type > b.type ? -1 : 1))
    .map((note) => {
      const buttonProps = {
        size,
        radius: "full",
        variant: "soft",
        color: "violet",
      } as const;
      switch (note.type) {
        case "drunk":
          return (
            <IconButton
              {...buttonProps}
              onClick={() => {
                updatePlayerNote(player, "remove", note);
              }}
            >
              <IoIosBeer className={className} />
            </IconButton>
          );
        case "poison":
          return (
            <IconButton
              {...buttonProps}
              onClick={() => {
                updatePlayerNote(player, "remove", note);
              }}
            >
              <FaVial className={className} />
            </IconButton>
          );
        case "bluffing":
          return (
            <MeaningfulStatusIcon
              size={size}
              color={buttonProps.color}
              header={
                <Flex gap="1">
                  <BsFillPersonBadgeFill />
                  <div>Bluffing</div>
                </Flex>
              }
              explanation={
                <>
                  <Text as="div">This person is bluffing as {note.as}.</Text>
                  <Dialog.Close>
                    <Button
                      onClick={() => {
                        updatePlayerNote(player, "remove", note);
                      }}
                    >
                      Clear Note
                    </Button>
                  </Dialog.Close>
                </>
              }
            >
              <BsFillPersonBadgeFill className={className} />
            </MeaningfulStatusIcon>
          );
        case "custom":
          return (
            <MeaningfulStatusIcon
              size={size}
              color="violet"
              header={
                <Flex gap="1">
                  <GiFeather />
                  <div>Custom note</div>
                </Flex>
              }
              explanation={
                <>
                  <Text as="div">{note.message}</Text>
                  <Dialog.Close>
                    <Button
                      onClick={() => {
                        updatePlayerNote(player, "remove", note);
                      }}
                    >
                      Clear Note
                    </Button>
                  </Dialog.Close>
                </>
              }
            >
              <GiFeather className={className} />
            </MeaningfulStatusIcon>
          );
      }
    });
}

export function NotesIcons({ player }: { player: string }) {
  const { game } = useDefiniteGame();

  const notes = game.playerNotes[player] ?? [];
  if (notes.length > 3) {
    return (
      <MeaningfulStatusIcon
        size="1"
        header={
          <Flex gap="1">
            <div>Notes</div>
          </Flex>
        }
        explanation={
          <Flex justify="between">
            <NotesIconList notes={notes} player={player} size="3" />
          </Flex>
        }
      >
        <BiDotsHorizontalRounded />
      </MeaningfulStatusIcon>
    );
  }
  return <NotesIconList notes={notes} player={player} size="1" />;
}

export function DeadVoteIcon({ player }: { player: string }) {
  const { game } = useDefiniteGame();
  const [, , , clearDeadVote] = useDeadVote();
  const showVote = !(game.deadPlayers[player] && game.deadVotes[player]);
  return (
    <div className="w-4">
      {showVote && (
        <IconButton
          size="1"
          color={game.deadPlayers[player] ? "gray" : "grass"}
          radius="full"
          variant="surface"
          onClick={() => {
            if (game.deadPlayers[player]) {
              clearDeadVote(player, true);
            }
          }}
        >
          <LiaVoteYeaSolid className="h-2" />
        </IconButton>
      )}
    </div>
  );
}
