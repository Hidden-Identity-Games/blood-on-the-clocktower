import type { Application } from 'express-ws'
import { useSocket } from './socket.ts'

export async function useRoutes (app: Application): Promise<void> {
  useSocket(app)
}
