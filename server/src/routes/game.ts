import {
  alignmentShape,
  characterAbilityStatusShape,
  deadStatusShape,
  drunkStatusShape,
  gameStatusShape,
  generateThreeWordId,
  playerMessageEntryShape,
  poisonStatusShape,
  protectedStatusShape,
  roleShape,
} from "@hidden-identity/shared";
import { z } from "zod";

import { addGame, getGame, retrieveGame } from "../database/gameDB/base.ts";
import { drawRole } from "../gameMachine/gameActions.ts";
import { setupTestGames } from "../testGames.ts";
import { GameCreator } from "../testingUtils/gameCreator.ts";
import {
  gmProcedure,
  playerProcedure,
  publicProcedure,
} from "../trpcServerInternals/trpc.ts";
import { gameIdShape, playerAndGameIdShape } from "./baseApiShapes.ts";

setupTestGames();

const testGameOptions = z.object({
  isTestGame: z.boolean(),
  players: z.onumber(),
  randomRoles: z.oboolean(),
});

export type TestGameOptions = z.TypeOf<typeof testGameOptions>;

export const gameRoutes = {
  getGame: publicProcedure
    .input(gameIdShape)
    .query(async ({ input: { gameId } }) => {
      // Retrieve users from a datasource, this is an imaginary database
      const game = await getGame(gameId);

      return game;
    }),
  createGame: publicProcedure
    .input(
      z.intersection(
        gameIdShape,
        z.object({
          script: z.array(z.object({ id: roleShape })),
          oldGameId: z.string().optional(),
          testGameOptions,
        }),
      ),
    )
    .mutation(
      async ({ input: { gameId, oldGameId, testGameOptions, script } }) => {
        let gameCreator = new GameCreator(script);
        if (testGameOptions?.isTestGame) {
          console.log(
            `generating test game: ${gameId}, ${JSON.stringify(
              testGameOptions,
            )}`,
          );

          if (testGameOptions.players) {
            gameCreator = gameCreator
              .addPlayers(testGameOptions.players)
              .assignSeating();
            if (testGameOptions.randomRoles) {
              gameCreator.assignRandomRolesToCharacters();
            }
          }
        }

        await addGame(gameId, gameCreator.toGameMachine().getGame(), script);

        if (oldGameId) {
          console.log(`recieved old gameID: ${oldGameId}, updating old game`);

          const oldGame = await retrieveGame(oldGameId);
          oldGame.dispatch({ type: "MakeNewGame", nextGameId: gameId });
        }

        return await getGame(gameId);
      },
    ),
  addPlayer: playerProcedure
    .input(playerAndGameIdShape)
    .mutation(async ({ input: { gameId, player } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({ type: "AddPlayer", player });
    }),
  kickPlayer: gmProcedure
    .input(playerAndGameIdShape)
    .mutation(async ({ input: { gameId, player } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({ type: "KickPlayer", player });
    }),
  setPlayerOrder: playerProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({ rightNeighbor: z.string().nullable() }),
      ),
    )
    .mutation(async ({ input: { gameId, player, rightNeighbor } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({
        type: "SetNeighbor",
        player,
        newRightNeighbor: rightNeighbor,
      });
    }),
  assignRoles: gmProcedure
    .input(z.intersection(gameIdShape, z.object({ roles: z.array(roleShape) })))
    .mutation(async ({ input: { gameId, roles } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({ type: "FillRoleBag", roles });
    }),
  decideFate: gmProcedure
    .input(
      z.intersection(playerAndGameIdShape, z.object({ dead: z.boolean() })),
    )
    .mutation(async ({ input: { gameId, player, dead } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({ type: dead ? "KillPlayer" : "RevivePlayer", player });
    }),
  addPlayerStatus: gmProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({
          playerStatus: z.union([
            poisonStatusShape,
            drunkStatusShape,
            protectedStatusShape,
            characterAbilityStatusShape,
            deadStatusShape,
          ]),
        }),
      ),
    )
    .mutation(async ({ input: { gameId, player, playerStatus } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({ type: "AddPlayerStatus", player, status: playerStatus });
    }),
  clearPlayerStatus: gmProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({
          playerStatusId: z.string(),
        }),
      ),
    )
    .mutation(async ({ input: { gameId, player, playerStatusId } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({
        type: "RemovePlayerStatus",
        player,
        statusId: playerStatusId,
      });
    }),
  setPlayerNote: gmProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({
          note: z.string(),
        }),
      ),
    )
    .mutation(async ({ input: { gameId, player, note } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({ type: "UpdateNote", newNote: note, player });
    }),
  setDeadVote: gmProcedure
    .input(
      z.intersection(playerAndGameIdShape, z.object({ voteUsed: z.boolean() })),
    )
    .mutation(async ({ input: { gameId, player, voteUsed } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({
        type: voteUsed ? "UseDeadVote" : "GiveBackDeadVote",
        player,
      });
    }),
  setVotesToExecute: gmProcedure
    .input(
      z.intersection(playerAndGameIdShape, z.object({ votes: z.number() })),
    )
    .mutation(async ({ input: { gameId, player, votes } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({
        type: "SetVotesToExecute",
        player,
        votesToExecute: votes,
      });
    }),
  clearVotesToExecute: gmProcedure
    .input(gameIdShape)
    .mutation(async ({ input: { gameId } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({ type: "ClearVotesToExecute" });
    }),
  setGameStatus: gmProcedure
    .input(z.intersection(gameIdShape, z.object({ status: gameStatusShape })))
    .mutation(async ({ input: { gameId, status } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({ type: "ManuallysetStatus", status });
    }),
  assignRole: gmProcedure
    .input(z.intersection(playerAndGameIdShape, z.object({ role: roleShape })))
    .mutation(async ({ input: { gameId, player, role } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({ type: "ChangePlayerRole", player, role });
    }),
  setAlignment: gmProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({ alignment: alignmentShape }),
      ),
    )
    .mutation(async ({ input: { gameId, player, alignment } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({
        type: "OverrideAlignment",
        player,
        newAlignment: alignment,
      });
    }),
  takeRole: playerProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({ numberDrawn: z.number() }),
      ),
    )
    .mutation(async ({ input: { gameId, player, numberDrawn } }) => {
      const game = await retrieveGame(gameId);
      const gameInstance = game.getGame();
      const role = gameInstance.roleBag[numberDrawn];

      if (role && gameInstance.playersToRoles[player]) {
        const action = drawRole({ roleNumber: numberDrawn, player });
        game.dispatch(action);
        return true;
      }
      return false;
    }),
  setPlayerSeenRole: playerProcedure
    .input(playerAndGameIdShape)
    .mutation(async ({ input: { gameId, player } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({ type: "SeenRole", player });
    }),
  createMessage: gmProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({ messages: z.array(playerMessageEntryShape) }),
      ),
    )
    .mutation(async ({ input: { gameId, player, messages } }) => {
      const game = await retrieveGame(gameId);
      const id = generateThreeWordId();
      game.dispatch({
        type: "CreateMessage",
        message: {
          player,
          id,
          nightNumber: 0,
          showState: "needs to be shown",
          messages,
        },
        player,
      });

      return id;
    }),
  deleteMessage: gmProcedure
    .input(z.intersection(gameIdShape, z.object({ messageId: z.string() })))
    .mutation(async ({ input: { gameId, messageId } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({
        type: "DeleteMessage",
        messageId,
      });
    }),
};
