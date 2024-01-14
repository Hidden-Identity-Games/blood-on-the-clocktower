import { pluck, type UnifiedGame } from "@hidden-identity/shared";
import { describe, expect, it } from "vitest";

import {
  addPlayersToGame,
  apiCaller,
  assignAllNeighbors,
  createGame,
  createGameWithPlayers,
  createPlayerList,
  createStartedGameWithPlayers,
} from "./utils.ts";

function playerListFromGame(game: UnifiedGame): string[] {
  return game.orderedPlayers.fullList;
}

describe("playerOrder", () => {
  describe("with a player problem", () => {
    describe("spiderman", () => {
      it("returns a list containing all players in an order", async () => {
        const { gameId, players } = await createGameWithPlayers();
        await assignAllNeighbors(players, gameId);
        await apiCaller.setPlayerOrder({
          player: players[1],
          gameId,
          rightNeighbor: players[0],
        });
        const orderedPlayers = playerListFromGame(
          await apiCaller.getGame({ gameId }),
        );
        players.forEach((player) => {
          expect(orderedPlayers).toContain(player);
        });
        // expect(orderedPlayers).toMatchObject([
        //   ...players.slice(2),
        //   players[0],
        //   players[1],
        // ]);
      });
    });
    describe("exlusion", () => {
      it("returns a list containing all players in an order", async () => {
        const { gameId, players } = await createGameWithPlayers();
        await apiCaller.setPlayerOrder({
          player: players[0],
          gameId,
          rightNeighbor: players[2],
        });
        for (let i = 1; i < players.length; i++) {
          await apiCaller.setPlayerOrder({
            player: players[i],
            gameId,
            rightNeighbor: players[(i + 1) % players.length],
          });
        }
        const game = await apiCaller.getGame({ gameId });
        expect(game.orderedPlayers.problems).toBeTruthy();
        const orderedPlayers = playerListFromGame(game);
        players.forEach((player) => {
          expect(orderedPlayers).toContain(player);
        });
        // expect(orderedPlayers).toMatchObject([...players.slice(1), players[0]]);
      });
    });
    describe("two circles", () => {
      it("returns a list containing all players in an order", async () => {
        const { gameId, players } = await createGameWithPlayers({
          playerCount: 14,
        });
        await assignAllNeighbors(players.slice(0, 4), gameId);
        await assignAllNeighbors(players.slice(4), gameId);

        const orderedPlayers = playerListFromGame(
          await apiCaller.getGame({ gameId }),
        );
        players.forEach((player) => {
          expect(orderedPlayers).toContain(player);
        });
        // expect(orderedPlayers).toMatchObject([
        //   ...players.slice(4),
        //   ...players.slice(0, 4),
        // ]);
      });
    });

    describe("players joining", () => {
      it("defaults neighbors to null", async () => {
        const gameId = await createGame();

        const players = createPlayerList(10);
        await addPlayersToGame(players, gameId);

        const game = await apiCaller.getGame({ gameId });

        players.forEach((player) => {
          expect(game.partialPlayerOrdering[player]).toMatchObject({
            rightNeighbor: null,
          });
        });
      });
      it("creates a full circle when all players have neighbors", async () => {
        const { gameId, players } = await createGameWithPlayers();
        await assignAllNeighbors(players, gameId);
        const game = await apiCaller.getGame({ gameId });
        expect(game.orderedPlayers.problems).toBeFalsy();
        expect(game.orderedPlayers.fullList).toHaveLength(players.length);
        expect(game.orderedPlayers.fullList).toMatchObject(players);
      });
    });
    describe("full player circle", () => {
      it("stays full circle when player leaves", async () => {
        const { gameId, players } = await createGameWithPlayers();
        await assignAllNeighbors(players, gameId);

        const playerListPreKick = playerListFromGame(
          await apiCaller.getGame({ gameId }),
        );
        const kickPlayer = pluck(playerListPreKick);

        await apiCaller.kickPlayer({
          gameId,
          player: kickPlayer,
        });
        const postKickGame = await apiCaller.getGame({ gameId });

        expect(postKickGame.orderedPlayers.problems).toBeFalsy();
        expect(playerListFromGame(postKickGame)).toMatchObject(
          playerListPreKick.filter((player) => player !== kickPlayer),
        );
      });
      it("adds new player at the end until they select a neighbor", async () => {
        const traveler = "TRAVELER:1";
        const { gameId, players } = await createGameWithPlayers();
        await assignAllNeighbors(players, gameId);
        const playerListBeforeAdd = playerListFromGame(
          await apiCaller.getGame({ gameId }),
        );
        await apiCaller.addPlayer({ player: traveler, gameId });
        expect(
          playerListFromGame(await apiCaller.getGame({ gameId })),
        ).toMatchObject([...playerListBeforeAdd, traveler]);
      });
    });
    describe("Game in progress", () => {
      it("stays full circle when player leaves", async () => {
        const { gameId } = await createStartedGameWithPlayers();

        const playerListPreKick = playerListFromGame(
          await apiCaller.getGame({ gameId }),
        );
        const kickPlayer = pluck(playerListPreKick);

        await apiCaller.kickPlayer({
          gameId,
          player: kickPlayer,
        });
        const postKickGame = await apiCaller.getGame({ gameId });

        expect(postKickGame.orderedPlayers.problems).toBeFalsy();
        expect(playerListFromGame(postKickGame)).toMatchObject(
          playerListPreKick.filter((player) => player !== kickPlayer),
        );
      });
      it("adds new player at the end until they select a neighbor", async () => {
        const traveler = "TRAVELER:1";
        const { gameId } = await createStartedGameWithPlayers();

        const playerListBeforeAdd = playerListFromGame(
          await apiCaller.getGame({ gameId }),
        );
        await apiCaller.addPlayer({ player: traveler, gameId });
        expect(
          playerListFromGame(await apiCaller.getGame({ gameId })),
        ).toMatchObject([...playerListBeforeAdd, traveler]);
      });
      it("inserts a player once they choose a neighbor", async () => {
        const traveler = "TRAVELER:1";
        const INSERT_AT = 4;
        const { gameId } = await createStartedGameWithPlayers();

        const playerListBeforeAdd = playerListFromGame(
          await apiCaller.getGame({ gameId }),
        );
        await apiCaller.addPlayer({ player: traveler, gameId });
        await apiCaller.setPlayerOrder({
          gameId,
          player: traveler,
          rightNeighbor: playerListBeforeAdd[INSERT_AT],
        });
        expect(
          playerListFromGame(await apiCaller.getGame({ gameId })),
        ).toMatchObject([
          ...playerListBeforeAdd.slice(0, INSERT_AT),
          traveler,
          ...playerListBeforeAdd.slice(INSERT_AT),
        ]);
      });
      it("player still shows with no neighbor", async () => {
        const REMOVE_AT = 4;
        const { gameId } = await createStartedGameWithPlayers();

        const playerListBeforeRemove = playerListFromGame(
          await apiCaller.getGame({ gameId }),
        );
        const playerToRemove = playerListBeforeRemove[REMOVE_AT];
        await apiCaller.setPlayerOrder({
          gameId,
          player: playerToRemove,
          rightNeighbor: null,
        });
        expect(
          playerListFromGame(await apiCaller.getGame({ gameId })),
        ).toMatchObject([
          ...playerListBeforeRemove.filter((p) => p !== playerToRemove),
          playerToRemove,
        ]);
      });
    });
  });
});
