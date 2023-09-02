/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, setDoc } from "firebase/firestore";
import { generate } from "random-words";
import { useNavigate } from "react-router-dom";

import { useMemo } from "react";
import { Game, Self, UnifiedGame } from "./Game";
import { useSecretKey } from "./secretKey";
import { unifiedGamesCollection } from "./firebaseStore";
import { useAction, useChangeGame, useGame } from "./GameContext";

export function usePlayers() {
  const { game } = useGame();
  return game?.players;
}
export function useRoles() {
  const { game } = useGame();
  return game?.playersToRoles;
}

export function useSelf() {
  const secretKey = useSecretKey();
  const players = usePlayers();
  const roles = useRoles();
  return (
    secretKey &&
    players !== null &&
    ({
      name: players?.[secretKey],
      role: roles?.[secretKey],
    } as Self)
  );
}

export function useCreateGame() {
  const playerSecretHash = useMemo(() => generate(3).join("-"), []);
  const gmSecretHash = useMemo(() => generate(3).join("-"), []);
  const navigate = useNavigate();
  return useAction(async () => {
    await setDoc(
      doc(unifiedGamesCollection, playerSecretHash),
      {
        gmSecretHash: gmSecretHash,
        players: {},
        playersToRoles: {},
      } as UnifiedGame,
      { merge: true },
    );
    navigate(`/${playerSecretHash}/gm/${gmSecretHash}`);
  });
}

export function useAddPlayer() {
  const secretKey = useSecretKey();

  return useChangeGame((game, playerName: string) => {
    if (Object.values(game.players ?? []).includes(playerName)) {
      throw new Error("Player name taken");
    }
    return {
      ...game,
      players: {
        [secretKey]: playerName,
      },
    };
  });
}

export function useDistributeRoles() {
  return useChangeGame((game, availableRoles: string[]) => {
    const playerIds = Object.keys(game.players);
    if (playerIds.length !== availableRoles.length) {
      throw new Error("Please select a role for each player");
    }

    const randomRoleSet = availableRoles
      .map((item) => ({ item, random: Math.random() }))
      .sort((a, b) => a.random - b.random)
      .map((element) => element.item)
      .reduce(
        (acc, item, idx) => ({
          ...acc,
          [playerIds[idx]]: item,
        }),
        {} as Record<string, string>,
      );
    return {
      ...game,
      playersToRoles: randomRoleSet,
    };
  });
}
export { useGame };
