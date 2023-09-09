import { useNavigate } from "react-router-dom";

import { useMemo } from "react";
import { Self, UnifiedGame } from "./Game";
import { useAction, useGame } from "./GameContext";
import { mapObject } from "../utils/mapObject";
import { apiUrl } from "./urlBuilder";
import axios, { AxiosError } from "axios";

export function usePlayerNamesToRoles(): Record<
  string,
  { name: string; role: string }
> {
  const { game } = useGame();
  if (!game) {
    throw new Error("ASDFASDF");
  }
  const { playersToNames, playersToRoles } = game;
  return mapObject(playersToNames, (hash, name: string) => [
    hash,
    { role: playersToRoles[hash], name },
  ]);
}

export function useSelf(secretKey: string) {
  const { game } = useGame();
  return (
    game &&
    ({
      name: game.playersToNames[secretKey],
      role: game.playersToRoles[secretKey],
    } as Self)
  );
}

function randomUppercase() {
  return String.fromCharCode(Math.random() * 26 + 65);
}

export function useCreateGame() {
  const playerSecretHash = useMemo(
    () => Array.from({ length: 5 }).map(randomUppercase).join(""),
    [],
  );
  const navigate = useNavigate();
  return useAction(async (currentGameId?: string) => {
    const response = await axios.post(apiUrl(`/game`), {
      hash: playerSecretHash,
      ...(currentGameId && { oldGameId: currentGameId }),
    });
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const parsedResponse = response.data as UnifiedGame;
    navigate(`/${playerSecretHash}/gm/${parsedResponse.gmSecretHash}`);
  });
}

export function useKickPlayer() {
  const { gameId } = useGame();

  return useAction(async (playerId: string) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    const response = await axios.post(apiUrl("/kick_player"), {
      playerId,
      gameId,
    });
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
  });
}

class NameTakenError extends Error {
  constructor(name: string) {
    super(`Name Taken: ${name}`);
  }
}
export function useAddPlayer({ secretKey }: { secretKey: string }) {
  const { gameId } = useGame();

  return useAction(async (playerName: string) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    try {
      const response = await axios.post(apiUrl("/add_player"), {
        playerName: playerName.toLocaleLowerCase(),
        playerId: secretKey,
        gameId,
      });
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.message.match(/name taken/i)) {
        throw new NameTakenError(playerName);
      }

      throw e;
    }
  });
}

class PlayerCountError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export function useDistributeRoles() {
  const { gameId } = useGame();

  return useAction(async (availableRoles: string[]) => {
    if (!gameId) {
      throw new Error("GameId not ready");
    }

    try {
      const response = await axios.post(apiUrl("/assign_roles"), {
        roles: availableRoles,
        gameId,
      });
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
    } catch (e: unknown) {
      if (
        e instanceof AxiosError &&
        e.response?.data?.match(/count does not match/i)
      ) {
        throw new PlayerCountError(e.response.data);
      }

      throw e;
    }
  });
}

export { useGame };
