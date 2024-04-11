import {
  getRandomCharactersForDistribution,
  getScript,
  type Script,
  type ScriptName,
} from "@hidden-identity/shared";
import { generate } from "random-words";

import { trpc } from "../api/client";
import { asyncMap } from "./utils";

/**
 * functions in this file help get games into states needed to start a test.  They do not test app funcionality, just help get things set up.
 * */
export const QuickSetupHelpers = {
  createNewGame: async function createNewGame(script: Script) {
    const gameId = generate(3).join("-").toUpperCase();
    const newGame = await trpc.createGame.mutate({
      gameId,
      script,
      testGameOptions: { isTestGame: true },
    });
    return { gameId, game: newGame };
  },

  createStartedGame: async function createStartableGame(
    script: ScriptName,
    players: string[],
  ) {
    const gameId = generate(3).join("-").toUpperCase();
    const newGame = await trpc.createGame.mutate({
      gameId,
      script: getScript(script),
      testGameOptions: {
        isTestGame: true,
        players: players.length,
        randomRoles: true,
      },
    });
    return { gameId, game: newGame };
  },

  addPlayerToGame: async function addPlayerToGame(
    gameId: string,
    player: string,
  ): Promise<void> {
    await trpc.addPlayer.mutate({ gameId, player });
  },

  populateGameWithPlayers: async function (
    players: string[],
    gameId: string,
  ): Promise<void> {
    await asyncMap(players, async (playerName) => {
      await QuickSetupHelpers.addPlayerToGame(gameId, playerName);
    });
  },

  assignSeats: async function ({
    gameId,
    players,
  }: {
    gameId: string;
    players: string[];
  }) {
    await asyncMap(players, async (player, playerNumber) => {
      const rightNeighbor = players[(playerNumber + 1) % players.length];

      await trpc.setPlayerOrder.mutate({
        gameId,
        player,
        rightNeighbor,
      });
    });
  },

  acknowledgeRoles: async function acknowledgeRoles({
    gameId,
    players,
  }: {
    gameId: string;
    players: string[];
  }) {
    await asyncMap(players, async (player, playerNumber) => {
      await trpc.takeRole.mutate({
        gameId,
        player,
        numberDrawn: playerNumber + 1,
      });
      await trpc.setPlayerSeenRole.mutate({ gameId, player });
    });
  },
  fillRoleBag: async function ({
    script,
    gameId,
    playerCount,
  }: {
    script: Script;
    gameId: string;
    playerCount: number;
  }) {
    const roles = getRandomCharactersForDistribution(script, playerCount)
      .map((c) => c.id)
      .reduce<Record<string, number>>(
        (acc, role) => ({ ...acc, [role]: (acc[role] || 0) + 1 }),
        {},
      );

    for (const key in roles) {
      await trpc.setSetupRole.mutate({ gameId, role: key, count: roles[key] });
    }

    await trpc.assignRoles.mutate({ gameId });
  },
};
