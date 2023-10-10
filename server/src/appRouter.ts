import { observable } from '@trpc/server/observable'

import { router, t } from './trpcServerInternals/trpc.ts'

import { gameRoutes } from './routes/game.ts'
import { scriptRoutes } from './routes/script.ts'
import { z } from 'zod'
import { subscribeToGame } from './database/gameDB/base.ts'
import { type MessageFromServer } from './types/messageShapes.ts'
import { subscribeToScript } from './database/scriptDB.ts'
type Post = MessageFromServer

export const appRouter = router({
  ...gameRoutes,
  ...scriptRoutes,
  healthcheck: t.procedure.query(() => {
    return 'Ok!'
  }),
  subscribeToGame: t.procedure.input(z.object({ gameId: z.string() })).subscription((resolver) => {
    const { gameId } = resolver.input
    return observable<Post>((emit) => {
      // This is all so wonky. We need to make sure to await our promises, otherwise errors will crash the server.
      // TODO: Fix this, async setup isn't supported.
      const gameUnsubPromise = subscribeToGame(gameId, (game) => {
        emit.next(
          {
            type: 'ObjectUpdated',
            objectType: 'game',
            updatedId: gameId,
            nextObj: game,
          },
        )
      }).catch(e => {
        emit.error(e)
        console.error(e)
        return () => {}
      })
      const scriptUnsubPromise = subscribeToScript(gameId, (script) => {
        emit.next(
          {
            type: 'ObjectUpdated',
            objectType: 'script',
            updatedId: gameId,
            nextObj: script,
          },
        )
      }).catch(e => {
        emit.error(e)
        console.error(e)
        return () => {}
      })

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      return async () => {
        (await gameUnsubPromise)();
        (await scriptUnsubPromise)()
      }
    })
  }),
})
