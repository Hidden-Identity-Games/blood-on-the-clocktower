import {
  getCharacter,
  type PlayerReminder,
  type Reminder,
  type Script,
} from "@hidden-identity/shared";
import { getDefaultAlignment } from "@hidden-identity/shared";
import { useCallback, useMemo, useState } from "react";

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
      navigate(`gm`, { gmSecretHash, gameId: newGameId }, true);
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

export function useAvailableReminders() {
  const { game } = useDefiniteGame();
  const { script } = game;
  const [allReminders, setAllReminders] = useState(false);

  const availableReminders: [string, Reminder[]][] = allReminders
    ? script.map((item) => ["", getCharacter(item.id).reminders] as const)
    : Object.entries(game.playersToRoles).map(
        ([player, role]) => [player, getCharacter(role).reminders] as const,
      );

  const reminderMap = availableReminders.flatMap(([player, reminders]) => {
    return reminders.map(
      (reminder) =>
        ({
          name: reminder.name,
          fromPlayer: player,
        }) as PlayerReminder,
    );
  });

  return [reminderMap, allReminders, setAllReminders] as const;
}

export function usePlayerOnBlock() {
  const { game } = useDefiniteGame();
  const alivePlayers = game.playerList.filter((p) => !game.deadPlayers[p]);
  const playerOnBlock = Object.entries(game.onTheBlock).reduce<{
    player: string | null;
    votes: number;
  }>(
    (max, current) => {
      if (max.votes === (current[1] ?? 0)) {
        return {
          player: max.player ? null : current[0],
          votes: max.player ? current[1] + 1 : current[1],
        };
      }
      if (max.votes < current[1]) {
        return { player: current[0], votes: current[1] };
      }
      return max;
    },
    { votes: Math.ceil(alivePlayers.length / 2), player: null },
  );

  return playerOnBlock;
}

export type DownloadedScriptItem = {
  id: string;
  name?: string;
  description?: string;
  image?: string;
};
export type DownloadedScript = DownloadedScriptItem[];

export function useScriptFromRepo() {
  return useAction(async (scriptUrl: string) => {
    return (await (
      await fetch(`${scriptUrl.trim()}/download`)
    ).json()) as DownloadedScript;
  });
}
