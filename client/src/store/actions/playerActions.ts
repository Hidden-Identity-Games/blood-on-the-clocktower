import { trpc } from "../../shared/trpcClient";
import { useAction, useGame } from "../GameContext";
import { usePlayer } from "../secretKey";

export function useAddPlayer() {
  const { gameId } = useGame();
  const [, setPlayer] = usePlayer();

  return useAction(async (player: string) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    await trpc.addPlayer.mutate({ player, gameId });
    setPlayer(player);
  });
}

export function useOrderPlayer() {
  const { gameId } = useGame();

  return useAction(async (player: string, rightNeighbor: string | null) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    await trpc.setPlayerOrder.mutate({
      gameId,
      player,
      rightNeighbor,
    });
  });
}

export function useKickPlayer() {
  const { gameId } = useGame();

  return useAction(async (player: string) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    await trpc.kickPlayer.mutate({ player, gameId });
  });
}

export function useTakeRole() {
  const { gameId } = useGame();

  return useAction(async (player: string, numberDrawn: number) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    return await trpc.takeRole.mutate({ gameId, player, numberDrawn });
  });
}

export function useSetPlayerSeenRole() {
  const { gameId } = useGame();

  return useAction(async (player: string) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    await trpc.setPlayerSeenRole.mutate({ player, gameId });
  });
}
