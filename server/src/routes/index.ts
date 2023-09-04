import type { Application } from 'express-ws'
import { useSocket } from './socket.ts'
import { useGame } from './game.ts'

export function useRoutes (app: Application): void {
  useSocket(app)
  useGame(app)
}
