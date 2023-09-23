import type { Application } from 'express-ws'
import { useSocket } from './socket.ts'
import { useGame } from './game.ts'
import { useScript } from './script.ts'

export async function useRoutes (app: Application): Promise<void> {
  useSocket(app)
  await useGame(app)
  useScript(app)
}
