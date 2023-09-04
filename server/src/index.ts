import expressWs from 'express-ws'
import express, { type Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
// import bodyParser from 'body-parser'

import { useRoutes } from './routes/index.ts'

dotenv.config()

const rawApp = express()
const app = expressWs(rawApp).app
const port = process.env.PORT

// app.use((req, response, next) => {
//   try {
//     console.log(`recieved ${JSON.stringify(req, null, 4)}`)
//     next()
//   } catch (e) {
//     response.status(500)
//     console.error(e)
//     response.send('Unable to process request')
//   }
// })
app.use(cors())

app.use(express.json())
app.use((req, res, next) => {
  console.log(`Recieved: ${JSON.stringify(req.url)}, body: ${JSON.stringify(req.body)}, headers: ${JSON.stringify(req.headers)}`)

  res.on('close', () => { console.log(`Sending: ${JSON.stringify(res.statusMessage)}`) })
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

useRoutes(app)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
