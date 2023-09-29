import expressWs from 'express-ws'
import express, { type Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { useRoutes } from './routes/index.ts'
import { router } from './trpc.ts'
import { createHTTPServer } from '@trpc/server/adapters/standalone'

import { gameRoutes } from './routes/game.ts'
import { scriptRoutes } from './routes/script.ts'
import { roleSelectRoutes } from './routes/roleSelect.ts'

const appRouter = router({
  ...gameRoutes,
  ...scriptRoutes,
  ...roleSelectRoutes,
})

const server = createHTTPServer({
  router: appRouter,
  onError: (error) => { console.log(error.error.message) },
})

server.listen(3001)

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter

dotenv.config()

const rawApp = express()
const app = expressWs(rawApp).app
const port = process.env.PORT
app.use(cors())

app.use(express.json())
app.use((req, res, next) => {
  console.log(
    `Recieved: ${JSON.stringify(req.url)}, body: ${JSON.stringify(
      req.body,
    )}, headers: ${JSON.stringify(req.headers)}`,
  )

  res.on('close', () => {
    console.log(`Sending: ${JSON.stringify(res.statusMessage)}`)
  })
  next()
})
app.use((err: Error, _req: unknown, res: Response, _next: unknown): void => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.status(200)
    res.send()
  } else {
    next()
  }
})

await useRoutes(app)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
