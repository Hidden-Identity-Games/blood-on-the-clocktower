import {
  Button,
  Dialog,
  Flex,
  IconButton,
  TextFieldInput,
} from "@radix-ui/themes";
import { GiFeather, GiRaiseZombie } from "react-icons/gi";
import {
  useDeadVote,
  useDecideFate,
  usePlayerNotes,
  useStatusEffects,
} from "../../store/useStore";
import { RxHamburgerMenu } from "react-icons/rx";
import { useDefiniteGame } from "../../store/GameContext";
import { PiKnifeBold } from "react-icons/pi";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { useState } from "react";
import { FaVial } from "react-icons/fa6";
import { IoIosBeer } from "react-icons/io";

interface PlayerMenuItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export function PlayerMenuItem({
  id,
  label,
  icon,
  onClick,
  disabled = false,
}: PlayerMenuItemProps) {
  return (
    <Flex className="text-xl" gap="3">
      <IconButton
        id={id}
        variant="soft"
        size="4"
        disabled={disabled}
        onClick={onClick}
      >
        {icon}
      </IconButton>
      <label htmlFor={id} className="flex-1 p-1">
        {label}
      </label>
    </Flex>
  );
}

interface PlayerNoteInputProps {
  player: string;
  handleAddNote: (note: string) => void;
  disabled?: boolean;
}

function PlayerNoteInput({
  player,
  handleAddNote,
  disabled = false,
}: PlayerNoteInputProps) {
  const [note, setNote] = useState("");

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton variant="ghost" disabled={disabled}>
          <GiFeather />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content className="m-2">
        <Dialog.Title className="capitalize">{player}: Add Note</Dialog.Title>
        <Flex direction="column" gap="4">
          <TextFieldInput
            value={note}
            onChange={(event) => setNote(event.currentTarget.value)}
          />
          <Flex justify="between">
            <Dialog.Close>
              <Button>Cancel</Button>
            </Dialog.Close>

            <Dialog.Close>
              <Button onClick={() => handleAddNote(note)}>Add</Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export function PlayerActions({ player }: { player: string }) {
  const { game } = useDefiniteGame();
  const [, decideFateLoading, , handleDecideFate] = useDecideFate();
  const [, deadVoteLoading, , setDeadVote] = useDeadVote();
  const [, playerNotesLoading, , setPlayerNote] = usePlayerNotes();
  const [, statusEffectsLoading, , setStatusEffect] = useStatusEffects();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton id={`${player}-menu-btn`} variant="ghost">
          <RxHamburgerMenu />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content className="m-2">
        <Flex direction="column" gap="2">
          <Dialog.Close>
            <PlayerMenuItem
              id={`${player}-toggle-dead`}
              label={game.deadPlayers[player] ? "Revive" : "Kill"}
              icon={
                game.deadPlayers[player] ? <GiRaiseZombie /> : <PiKnifeBold />
              }
              onClick={() =>
                handleDecideFate(player, !game.deadPlayers[player])
              }
              disabled={decideFateLoading}
            />
          </Dialog.Close>
          <PlayerMenuItem
            id={`${player}-add-note`}
            label="Add Note"
            icon={
              <PlayerNoteInput
                player={player}
                handleAddNote={(note) =>
                  setPlayerNote(player, "add", {
                    message: note,
                    id: `${player}-${note}`,
                  })
                }
              />
            }
            onClick={() => {}}
            disabled={playerNotesLoading}
          />
          <Dialog.Close>
            <PlayerMenuItem
              id={`${player}-set-poison`}
              label="Poisoned"
              icon={<FaVial />}
              onClick={() =>
                setStatusEffect(player, "add", {
                  type: "poison",
                  id: `${player}-poisoned`,
                })
              }
              disabled={statusEffectsLoading}
            />
          </Dialog.Close>
          <Dialog.Close>
            <PlayerMenuItem
              id={`${player}-set-drunk`}
              label="Drunk"
              icon={<IoIosBeer />}
              onClick={() =>
                setStatusEffect(player, "add", {
                  type: "drunk",
                  id: `${player}-drunk`,
                })
              }
              disabled={statusEffectsLoading}
            />
          </Dialog.Close>
          {game.deadVotes[player] && (
            <Dialog.Close>
              <PlayerMenuItem
                id={`${player}-return-dead-vote`}
                label="Return Dead Vote"
                icon={
                  game.deadVotes[player] ? (
                    <AiFillPlusCircle />
                  ) : (
                    <AiFillMinusCircle />
                  )
                }
                onClick={() => setDeadVote(player, false)}
                disabled={deadVoteLoading}
              />
            </Dialog.Close>
          )}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
