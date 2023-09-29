import { z } from 'zod'
import { playerProcedure } from '../trpc.ts'
import { gameIdShape, roleShape } from './baseApiShapes.ts'
import { setRoleTaken } from '../database/roleSelectDB.ts'

export const roleSelectRoutes = {
  takeRole: playerProcedure
    .input(
      z.intersection(
        gameIdShape,
        z.object({ role: roleShape }),
      ),
    ).mutation(async ({ input: { gameId, role } }) => {
      return setRoleTaken(gameId, role)
    }),
}
