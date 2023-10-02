import { applyWSSHandler } from '@trpc/server/adapters/ws'
import { WebSocketServer } from 'ws'
import { appRouter } from '../appRouter.ts'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import cors from 'cors'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createServer () {
  const server = createHTTPServer({
    middleware: cors(),
    router: appRouter,
    onError: (error) => { console.log(error.error.message) },
  })

  const wss = new WebSocketServer({
    server: server.server,
  })

  const handler = applyWSSHandler({ wss, router: appRouter })
  wss.on('connection', (ws) => {
    console.log(`➕➕ Connection (${wss.clients.size})`)
    ws.once('close', () => {
      console.log(`➖➖ Connection (${wss.clients.size})`)
    })
  })
  process.on('SIGTERM', () => {
    console.log('SIGTERM')
    handler.broadcastReconnectNotification()
    wss.close()
  })

  // @ts-expect-error Need to update TS
  server.listen(process.env.SERVER_PORT)
  const addressBase = server.server.address()
  const port = typeof addressBase === 'string' ? '???' : addressBase?.port
  console.log(`✅ WebSocket Server listening on https://localhost:${port}`)

  return server
}
