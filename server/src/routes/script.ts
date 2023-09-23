import { type Application } from 'express-ws'
import { setScript } from '../database/scriptDB.ts'

export function useScript (app: Application): void {
  app.post('/set_script', (req, res) => {
    const { gameId, script } = req.body
    setScript(gameId, script).then(() => {
      res.status(200)
      res.send({})
    }, () => { throw new Error(`Failed to set script to ${gameId}`) })
  })
}
