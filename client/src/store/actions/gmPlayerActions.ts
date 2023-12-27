import {
  type Alignment,
  type PlayerReminder,
  type Role,
} from "@hidden-identity/shared";

import { trpc } from "../../shared/trpcClient";
import { useAction, useGame } from "../GameContext";

export function useAssignRole() {
  const { gameId } = useGame();

  return useAction(async (player: string, role: Role) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    await trpc.assignRole.mutate({ gameId, player, role: role });
  });
}

export function useAssignPlayerAlignment() {
  const { gameId } = useGame();

  return useAction(async (player: string, alignment: Alignment) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    await trpc.setAlignment.mutate({ alignment, player, gameId });
  });
}

export function usePlayerNotes() {
  const { gameId } = useGame();

  return useAction(async (player: string, note: string) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    await trpc.setPlayerNote.mutate({ gameId, player, note });
  });
}

export function useDecideFate() {
  const { gameId } = useGame();

  return useAction(async (player: string, dead: boolean) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    await trpc.decideFate.mutate({ player, gameId, dead });
  });
}

export function useVotesToExecute() {
  const { gameId } = useGame();

  return useAction(async (player: string, votes: number) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    await trpc.setVotesToExecute.mutate({ gameId, player, votes });
  });
}

export function useClearVotesToExecute() {
  const { gameId } = useGame();

  return useAction(async () => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    await trpc.clearVotesToExecute.mutate({ gameId });
  });
}

export function usePlayerReminder() {
  const { gameId } = useGame();

  return useAction(async (reminder: PlayerReminder) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    await trpc.addPlayerReminder.mutate({
      gameId,
      reminderText: reminder.reminderText,
      fromPlayer: reminder.fromPlayer,
      toPlayer: reminder.toPlayer,
      startNight: reminder.startNight,
      archetype: reminder.archetype,
    });
  });
}

export function useClearPlayerReminder() {
  const { gameId } = useGame();

  return useAction(async (reminderId: string) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    await trpc.clearPlayerReminder.mutate({ gameId, reminderId });
  });
}
