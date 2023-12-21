import { type Script } from "@hidden-identity/shared";
import { getDefaultAlignment } from "@hidden-identity/shared";
import { useCallback, useMemo } from "react";

import { trpc } from "../shared/trpcClient";
import { type UnifiedGame } from "./Game";
import { useAction, useDefiniteGame, useGame } from "./GameContext";
import { useSafeNavigate } from "./url";

function randomUppercase() {
  return String.fromCharCode(Math.random() * 26 + 65);
}

export function useCreateGame() {
  const newGameId = useMemo(
    () => Array.from({ length: 5 }).map(randomUppercase).join(""),
    [],
  );
  const navigate = useSafeNavigate();
  return useAction(
    async (
      arg: Omit<Parameters<typeof trpc.createGame.mutate>[0], "gameId">,
    ) => {
      const { gmSecretHash }: UnifiedGame = await trpc.createGame.mutate({
        ...arg,
        gameId: newGameId,
      });
      navigate(`gm`, { gmSecretHash, gameId: newGameId });
    },
  );
}

export function useSetScript() {
  const { gameId } = useGame();

  return useAction(async (script: Script) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    await trpc.setScript.mutate({ gameId, script });
  });
}

export { useGame };

export function useGetPlayerAlignment() {
  const { game } = useDefiniteGame();
  const getAlignment = useCallback(
    (player: string) => {
      if (game.travelers[player] && !game.alignmentsOverrides[player]) {
        throw new Error("Found traveler without alignment");
      }
      return (
        game.alignmentsOverrides[player] ??
        getDefaultAlignment(game.playersToRoles[player])
      );
    },
    [game],
  );

  return getAlignment;
}
