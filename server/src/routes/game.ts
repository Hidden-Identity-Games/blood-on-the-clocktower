import { type Application } from 'express-ws'
import {
  addGame,
  addPlayer,
  assignRoles,
  getGame,
  kickPlayer,
  setPlayerOrder,
} from '../database/gameDB.ts'

export function useGame (app: Application): void {
  addGame('test-game')
  app.post('/game', (_req, res) => {
    const gameId = _req.body.hash

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
    const { player, gameId } = req.body
    kickPlayer(gameId, player)
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
    const message = assignRoles(gameId, roles)
    if (!message) {
      res.status(200)
      res.send({})
    } else {
      res.status(400)
      res.send(message)
    }
  })
}
