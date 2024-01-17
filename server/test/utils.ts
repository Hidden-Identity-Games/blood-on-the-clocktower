import { fakerEN } from "@faker-js/faker";
import {
  generateThreeWordId,
  getScript,
  type Script,
} from "@hidden-identity/shared";

import { appRouter } from "../src/appRouter.ts";
import { trpcBase } from "../src/trpcServerInternals/trpc.ts";

export const apiCaller = trpcBase.createCallerFactory(appRouter)({});

export function createPlayerList(players: number) {
  return Array.from({ length: players }, () => fakerEN.person.firstName());
}

export async function addPlayersToGame(players: string[], gameId: string) {
  for (const player of players) {
    await apiCaller.addPlayer({ player, gameId });
  }
}

export async function assignAllNeighbors(players: string[], gameId: string) {
  for (let i = 0; i < players.length; i++) {
    await apiCaller.setPlayerOrder({
      player: players[i],
      gameId,
      rightNeighbor: players[(i + 1) % players.length],
    });
  }
}

// Game creation

export async function createGame(
  script: Script = getScript("Sects & Violets"),
) {
  const gameId = `t_${generateThreeWordId()}`;

  await apiCaller.createGame({
    script,
    gameId,
    testGameOptions: { isTestGame: false },
  });

  return gameId;
}

export async function createGameWithPlayers({
  playerCount = 10,
  script,
}: {
  playerCount?: number;
  script?: Script;
} = {}) {
  const gameId = await createGame(script);
  const players = createPlayerList(playerCount);
  await addPlayersToGame(players, gameId);
  return { gameId, players };
}

export async function createStartedGameWithPlayers({
  playerCount = 10,
  script = getScript("No Roles Barred"),
}: {
  playerCount?: number;
  script?: Script;
} = {}) {
  const gameId = `t_${generateThreeWordId()}`;

  await apiCaller.createGame({
    gameId,
    script,
    testGameOptions: {
      isTestGame: true,
      players: playerCount,
      randomRoles: true,
    },
  });

  return { gameId };
}
