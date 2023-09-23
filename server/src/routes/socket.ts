import { type Application } from 'express-ws'
import { parseMessage, createMessage } from '../messenger.ts'
import { subscribeToGame } from '../database/gameDB.ts'
import { subscribeToScript } from '../database/scriptDB.ts'

export function useSocket (app: Application): void {
  app.ws('/socket', (ws, req) => {
    console.log(`Connection esablished ${req.ip}`)
    ws.on('close', () => {
      console.log(`Closed: ${req.ip}`)
    })
    ws.on('message', (rawMsg) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        const message = rawMsg.toString()
        console.log(`recieved message ${message}}`)
        const parsedMessage = parseMessage(message)
        if (parsedMessage.type === 'ListenToGame') {
          subscribeToGame(parsedMessage.gameId, (game) => {
            ws.send(
              createMessage({
                type: 'ObjectUpdated',
                objectType: 'game',
                updatedId: parsedMessage.gameId,
                nextObj: game,
              }),
            )
          }).catch((e) => { console.error(e) })
          subscribeToScript(parsedMessage.gameId, (script) => {
            ws.send(
              createMessage({
                type: 'ObjectUpdated',
                objectType: 'script',
                updatedId: parsedMessage.gameId,
                nextObj: script,
              }),
            )
          }).catch((e) => { console.error(e) })
        }
      } catch (e) {
        console.error(e)
        // inform client
      }
    })
  })
}
