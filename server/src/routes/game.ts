import { type Application } from 'express-ws'
import {
  addGame,
  addPlayer,
  assignRoles,
  getGame,
  kickPlayer,
  retrieveGame,
  setPlayerOrder,
} from '../database/gameDB.ts'

export function useGame (app: Application): void {
  addGame('test-game')
  app.post('/game', (req, res) => {
    const { hash: gameId, oldGameId } = req.body

    if (oldGameId) {
      console.log(`recieved old gameID: ${oldGameId}, updating old game`)

      const oldGame = retrieveGame(oldGameId)
      oldGame.update({
        ...oldGame.readOnce(),
        nextGameId: gameId,
      })
    }
    console.log(`creating new game ${gameId}`)
    addGame(gameId)
    const game = getGame(gameId)
    console.log(`Game created ${gameId}`)
    console.log(`responding with: ${JSON.stringify(game)}`)
    res.send(game)
  })

  app.get('/game/:gameId', (_req, res) => {
    const gameId = _req.params.gameId
    const game = getGame(gameId)
    if (!game) {
      res.status(404)
    }
    res.send(game)
  })

  app.post('/add_player', (req, res) => {
    const { player, gameId } = req.body
    addPlayer(gameId, player)
    res.status(200)
    res.send({
      player,
    })
  })

  app.post('/kick_player', (req, res) => {
    const { playerId, gameId } = req.body
    kickPlayer(gameId, playerId)
    res.status(200)
    res.send({})
  })

  app.post('/order_player', (req, res) => {
    const { player, leftNeighbor, rightNeighbor, gameId } = req.body
    setPlayerOrder(gameId, player, leftNeighbor, rightNeighbor)
    res.status(200)
    res.send({})
  })

  app.post('/assign_roles', (req, res) => {
    const { roles, gameId } = req.body
    assignRoles(gameId, roles)
    res.status(200)
    res.send({})
  })
}
