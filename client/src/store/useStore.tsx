import { useNavigate } from "react-router-dom";

import { useCallback, useMemo } from "react";
import { UnifiedGame } from "./Game";
import { useAction, useDefiniteGame, useGame } from "./GameContext";
import { Script } from "@hidden-identity/server";
import { getDefaultAlignment } from "../assets/game_data/gameData";
import { trpc } from "../shared/trpcClient";

function randomUppercase() {
  return String.fromCharCode(Math.random() * 26 + 65);
}

export function useCreateGame() {
  const newGameId = useMemo(
    () => Array.from({ length: 5 }).map(randomUppercase).join(""),
    [],
  );
  const navigate = useNavigate();
  return useAction(async (currentGameId?: string) => {
    const parsedResponse: UnifiedGame = await trpc.createGame.mutate({
      gameId: newGameId,
      oldGameId: currentGameId ?? undefined,
    });
    navigate(`/${newGameId}/gm/${parsedResponse.gmSecretHash}`);
  });
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
