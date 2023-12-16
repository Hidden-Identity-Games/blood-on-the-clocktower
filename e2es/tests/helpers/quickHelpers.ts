import { Script, ScriptName, getScript } from "@hidden-identity/shared";
import { asyncMap, getRandomCharactersForDistribution } from "./utils";
import { trpc } from "../api/client";
import { generate } from "random-words";

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
    playerCount: number,
  ) {
    const gameId = generate(3).join("-").toUpperCase();
    const newGame = await trpc.createGame.mutate({
      gameId,
      script: getScript(script),
      testGameOptions: {
        isTestGame: true,
        players: playerCount,
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
    const roles = getRandomCharactersForDistribution(script, playerCount).map(
      (c) => c.id,
    );
    await trpc.assignRoles.mutate({ roles, gameId });
  },
};
