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
} from '../database/gameDB/player.ts'
import { setupTestGames } from '../testGames.ts'
import { gmProcedure, playerProcedure, publicProcedure } from '../trpc.ts'
import { z } from 'zod'
import { alignmentShape } from '../types/Role.ts'
import { poisonStatusShape, drunkStatusShape, customStatusShape, gameStatusShape } from '../types/UnifiedGame.ts'
import { gameIdShape, playerAndGameIdShape, roleShape } from './baseApiShapes.ts'

setupTestGames()

export const gameRoutes = {
  getGame: publicProcedure
    .input(gameIdShape)
    .query(async ({ input: { gameId } }) => {
      // Retrieve users from a datasource, this is an imaginary database
      const game = getGame(gameId)

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
      addGame(gameId)
      if (oldGameId) {
        console.log(`recieved old gameID: ${oldGameId}, updating old game`)

        const oldGame = retrieveGame(oldGameId)
        oldGame.update({
          ...oldGame.readOnce(),
          nextGameId: gameId,
        })
      }

      return getGame(gameId)
    },
    ),
  addPlayer: playerProcedure
    .input(playerAndGameIdShape)
    .mutation(({ input: { gameId, player } }) => {
      addPlayer(gameId, player)
      return player
    }),
  kickPlayer: gmProcedure
    .input(playerAndGameIdShape)
    .mutation(({ input: { gameId, player } }) => {
      kickPlayer(gameId, player)
      return null
    }),
  setPlayerOrder: playerProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({ rightNeighbor: z.string().nullable() }),
      ),
    ).mutation(({ input: { gameId, player, rightNeighbor } }) => {
      setPlayerOrder(gameId, player, rightNeighbor)
      return null
    }),
  assignRoles: gmProcedure
    .input(
      z.intersection(
        gameIdShape,
        z.object({ roles: z.array(roleShape) }),
      ),
    )
    .mutation(({ input: { gameId, roles } }) => {
      assignRoles(gameId, roles)
    }),
  decideFate: gmProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({ dead: z.boolean() }),
      ),
    )
    .mutation(({ input: { gameId, player, dead } }) => {
      setPlayerFate(gameId, player, dead)
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
    .mutation(({ input: { gameId, player, playerStatus } }) => {
      addPlayerStatus(gameId, player, playerStatus)
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
    .mutation(({ input: { gameId, player, playerStatusId } }) => {
      clearPlayerStatus(gameId, player, playerStatusId)
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
    .mutation(({ input: { gameId, player, note } }) => {
      setPlayerNote(gameId, player, note)
    }),
  setDeadVote: gmProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({ voteUsed: z.boolean() }),
      ),
    ).mutation(({ input: { gameId, player, voteUsed } }) => {
      toggleDeadvote(gameId, player, voteUsed)
    }),
  setGameStatus: gmProcedure
    .input(
      z.intersection(
        gameIdShape,
        z.object({ status: gameStatusShape }),
      ),
    ).mutation(({ input: { gameId, status } }) => {
      updateStatus(gameId, status)
    }),
  assignRole: gmProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({ role: roleShape }),
      ),
    ).mutation(({ input: { gameId, player, role } }) => {
      assignPlayerToRole(gameId, player, role)
    }),
  setAlignment: gmProcedure
    .input(
      z.intersection(
        playerAndGameIdShape,
        z.object({ alignment: alignmentShape }),
      ),
    ).mutation(({ input: { gameId, player, alignment } }) => {
      setAlignment(gameId, player, alignment)
    }),
}
