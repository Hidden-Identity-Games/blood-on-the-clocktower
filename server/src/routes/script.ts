import { setScript } from '../database/scriptDB.ts'
import { gmProcedure } from '../trpcServerInternals/trpc.ts'
import { gameIdShape, roleShape } from './baseApiShapes.ts'
import { z } from 'zod'

export const scriptRoutes = {
  setScript: gmProcedure
    .input(
      z.intersection(
        gameIdShape,
        z.object({ script: z.array(z.object({ id: roleShape })) }),
      ))
    .mutation(async ({ input: { gameId, script } }) => {
      // Retrieve users from a datasource, this is an imaginary database
      await setScript(gameId, script)
    }),
}
