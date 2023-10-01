import { type appRouter } from './appRouter.ts'
import { createServer } from './trpcServerInternals/createServer.ts'

createServer()

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
