import { observable } from "@trpc/server/observable";
import { z } from "zod";

import { subscribeToGame } from "./database/gameDB/base.ts";
import { gameRoutes } from "./routes/game.ts";
import { scriptRoutes } from "./routes/script.ts";
import { router, trpcBase } from "./trpcServerInternals/trpc.ts";
import { type MessageFromServer } from "./types/messageShapes.ts";

export const appRouter = router({
  ...gameRoutes,
  ...scriptRoutes,
  healthcheck: trpcBase.procedure.query(() => {
    return "Ok!";
  }),
  subscribeToGame: trpcBase.procedure
    .input(z.object({ gameId: z.string() }))
    .subscription((resolver) => {
      const { gameId } = resolver.input;
      return observable<MessageFromServer>((emit) => {
        // This is all so wonky. We need to make sure to await our promises, otherwise errors will crash the server.
        // TODO: Fix this, async setup isn't supported.
        const gameUnsubPromise = subscribeToGame(gameId, (game) => {
          emit.next({
            type: "ObjectUpdated",
            objectType: "game",
            updatedId: gameId,
            nextObj: game,
          });
        }).catch((e) => {
          emit.error(e);
          console.error(e);
          if (e instanceof Error) {
            console.error(e.stack);
          }
          return () => {};
        });

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        return async () => {
          (await gameUnsubPromise)();
        };
      });
    }),
});
