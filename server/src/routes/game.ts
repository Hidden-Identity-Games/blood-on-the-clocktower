import {
  alignmentShape,
  gameStatusShape,
  playerMessageEntryShape,
  playerReminderShape,
  roleShape,
} from "@hidden-identity/shared";
import { z } from "zod";

import { addGame, getGame, retrieveGame } from "../database/gameDB/base.ts";
import {
  addPlayerAction,
  addReminderAction,
  createMessageAction,
  drawRoleAction,
  progressTimeAction,
} from "../gameMachine/gameActions.ts";
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

        await addGame(gameId, gameCreator.toGameMachine());

        if (oldGameId) {
          console.log(`recieved old gameID: ${oldGameId}, updating old game`);

          const oldGame = await retrieveGame(oldGameId);
          oldGame.dispatch({ type: "MakeNewGame", nextGameId: gameId });
        }

        const game = await getGame(gameId);
        console.log(game.script);
        return game;
      },
    ),
  addPlayer: playerProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({ forceTraveling: z.oboolean() }),
      ),
    )
    .mutation(async ({ input: { gameId, player, forceTraveling } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch(addPlayerAction({ player, forceTraveling }));
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
  addPlayerReminder: gmProcedure
    .input(
      z.intersection(gameIdShape, z.object({ reminder: playerReminderShape })),
    )
    .mutation(async ({ input: { gameId, reminder } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch(addReminderAction({ reminder }));
    }),
  clearPlayerReminder: gmProcedure
    .input(
      z.intersection(
        gameIdShape,
        z.object({
          reminderId: z.string(),
        }),
      ),
    )
    .mutation(async ({ input: { gameId, reminderId } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({
        type: "ClearPlayerReminder",
        reminderId,
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
        const action = drawRoleAction({ roleNumber: numberDrawn, player });
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
      return game.dispatch(createMessageAction({ player, messages }));
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
  progressTime: gmProcedure
    .input(gameIdShape)
    .mutation(async ({ input: { gameId } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch(progressTimeAction());
    }),
  completeAction: gmProcedure
    .input(z.intersection(gameIdShape, z.object({ actionId: z.string() })))
    .mutation(async ({ input: { gameId, actionId } }) => {
      const game = await retrieveGame(gameId);
      game.dispatch({ type: "CompleteAction", itemId: actionId });
    }),
  undo: gmProcedure
    .input(gameIdShape)
    .mutation(async ({ input: { gameId } }) => {
      const game = await retrieveGame(gameId);
      return game.undo();
    }),
};
