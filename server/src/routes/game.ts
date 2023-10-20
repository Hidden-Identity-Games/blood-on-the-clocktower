import {
  addGame,
  getGame,
  retrieveGame,
  updateStatus,
} from '../database/gameDB/base.ts'
import {
  assignPlayerToRole,
} from '../database/gameDB/seating.ts'
import {
  addPlayerStatus,
  addPlayer,
  assignRoles,
  clearPlayerStatus,
  kickPlayer,
  setPlayerFate,
  setPlayerNote,
  setPlayerOrder,
  toggleDeadvote,
  setAlignment,
  setDrawRole,
  setPlayerHasSeenRole,
} from '../database/gameDB/player.ts'
import { setupTestGames } from '../testGames.ts'
import { gmProcedure, playerProcedure, publicProcedure } from '../trpcServerInternals/trpc.ts'
import { z } from 'zod'
import { alignmentShape } from '../types/Role.ts'
import { poisonStatusShape, drunkStatusShape, customStatusShape, gameStatusShape } from '../types/UnifiedGame.ts'
import { gameIdShape, playerAndGameIdShape, roleShape } from './baseApiShapes.ts'

await setupTestGames()

export const gameRoutes = {
  getGame: publicProcedure
    .input(gameIdShape)
    .query(async ({ input: { gameId } }) => {
      // Retrieve users from a datasource, this is an imaginary database
      const game = await getGame(gameId)

      return game
    }),
  createGame: publicProcedure
    .input(
      z.intersection(
        gameIdShape,
        z.object({
          oldGameId: z.string().optional(),
        })),
    )
    .mutation(async ({ input: { gameId, oldGameId } }) => {
      await addGame(gameId)
      if (oldGameId) {
        console.log(`recieved old gameID: ${oldGameId}, updating old game`)

        const oldGame = await retrieveGame(oldGameId)
        oldGame.update({
          ...oldGame.readOnce(),
          nextGameId: gameId,
        })
      }

      return await getGame(gameId)
    },
    ),
  addPlayer: playerProcedure
    .input(playerAndGameIdShape)
    .mutation(async ({ input: { gameId, player } }) => {
      await addPlayer(gameId, player)
      return player
    }),
  kickPlayer: gmProcedure
    .input(playerAndGameIdShape)
    .mutation(async ({ input: { gameId, player } }) => {
      await kickPlayer(gameId, player)
      return null
    }),
  setPlayerOrder: playerProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({ rightNeighbor: z.string().nullable() }),
      ),
    ).mutation(async ({ input: { gameId, player, rightNeighbor } }) => {
      await setPlayerOrder(gameId, player, rightNeighbor)
      return null
    }),
  assignRoles: gmProcedure
    .input(
      z.intersection(
        gameIdShape,
        z.object({ roles: z.array(roleShape) }),
      ),
    )
    .mutation(async ({ input: { gameId, roles } }) => {
      await assignRoles(gameId, roles)
    }),
  decideFate: gmProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({ dead: z.boolean() }),
      ),
    )
    .mutation(async ({ input: { gameId, player, dead } }) => {
      await setPlayerFate(gameId, player, dead)
    }),
  addPlayerStatus: gmProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({
          playerStatus:
          z.union([poisonStatusShape, drunkStatusShape, customStatusShape]),
        }),
      ),
    )
    .mutation(async ({ input: { gameId, player, playerStatus } }) => {
      await addPlayerStatus(gameId, player, playerStatus)
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
      await clearPlayerStatus(gameId, player, playerStatusId)
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
      await setPlayerNote(gameId, player, note)
    }),
  setDeadVote: gmProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({ voteUsed: z.boolean() }),
      ),
    ).mutation(async ({ input: { gameId, player, voteUsed } }) => {
      await toggleDeadvote(gameId, player, voteUsed)
    }),
  setGameStatus: gmProcedure
    .input(
      z.intersection(
        gameIdShape,
        z.object({ status: gameStatusShape }),
      ),
    ).mutation(async ({ input: { gameId, status } }) => {
      await updateStatus(gameId, status)
    }),
  assignRole: gmProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({ role: roleShape }),
      ),
    ).mutation(async ({ input: { gameId, player, role } }) => {
      await assignPlayerToRole(gameId, player, role)
    }),
  setAlignment: gmProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({ alignment: alignmentShape }),
      ),
    ).mutation(async ({ input: { gameId, player, alignment } }) => {
      await setAlignment(gameId, player, alignment)
    }),
  takeRole: playerProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({ numberDrawn: z.number() }),
      ),
    ).mutation(async ({ input: { gameId, player, numberDrawn } }) => {
      return await setDrawRole(gameId, player, numberDrawn)
    }),
  setPlayerSeenRole: playerProcedure
    .input(
      playerAndGameIdShape,
    ).mutation(async ({ input: { gameId, player } }) => {
      await setPlayerHasSeenRole(gameId, player)
    }),
}
