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
        const scriptUnsubPromise = subscribeToScript(gameId, (script) => {
          emit.next(
            {
              type: 'ObjectUpdated',
              objectType: 'script',
              updatedId: gameId,
              nextObj: script,
            },
          )
        })
        return async () => {
          (await gameUnsubPromise)();
          (await scriptUnsubPromise)()
        }
      })
    })
  }),
})
