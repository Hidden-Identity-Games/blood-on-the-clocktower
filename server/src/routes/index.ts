import type { Application } from 'express-ws'
import { useSocket } from './socket.ts'

export function useRoutes (app: Application): void {
  useSocket(app)
}
