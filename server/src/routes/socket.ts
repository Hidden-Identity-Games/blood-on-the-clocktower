import { type Application } from 'express-ws'
import { parseMessage, createMessage } from '../messenger.ts'
import { subscribeToGame } from '../database/gameDB.ts'

export function useSocket (app: Application): void {
  app.ws('/socket', (ws) => {
    console.log('Connection esablished')
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
          })
        }
      } catch (e) {
        console.error(e)
        // inform client
      }
    })
  })
}
