import { TRPCClientError } from "@trpc/client";
import { trpc } from "../../shared/trpcClient";
import { useAction, useGame } from "../GameContext";
import { GameStatus, Role } from "@hidden-identity/server";

export function useDeadVote() {
  const { gameId } = useGame();

  return useAction(async (player: string, voteUsed: boolean) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    await trpc.setDeadVote.mutate({
      player,
      gameId,
      voteUsed,
    });
  });
}

class PlayerCountError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export function useDistributeRoles() {
  const { gameId } = useGame();

  return useAction(async (availableRoles: Role[]) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    try {
      await trpc.assignRoles.mutate({
        gameId,
        roles: availableRoles,
      });
    } catch (e: unknown) {
      if (
        // TODO: catch this better!  It likely won't catch a scenario where someone joins right as you click start
        e instanceof TRPCClientError &&
        e.message?.match(/count does not match/i)
      ) {
        throw new PlayerCountError(e.data);
      }

      throw e;
    }
  });
}

export function useSetGameStatus() {
  const { gameId } = useGame();

  return useAction(async (status: GameStatus) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    await trpc.setGameStatus.mutate({ gameId, status });
  });
}