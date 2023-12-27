import { type Alignment, type Role } from "@hidden-identity/shared";

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
