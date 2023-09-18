import { type Application } from 'express-ws'
import {
  addGame,
  addPlayerStatus,
  addPlayer,
  assignRoles,
  clearPlayerStatus,
  getGame,
  kickPlayer,
  retrieveGame,
  setPlayerFate,
  setPlayerNote,
  setPlayerOrder,
  toggleDeadvote,
  updateStatus,
  assignPlayerToRole,
  setAlignment,
} from '../database/gameDB.ts'
import { setupTestGames } from '../testGames.ts'

export function useGame (app: Application): void {
  setupTestGames()
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
    const { player, gameId } = req.body
    kickPlayer(gameId, player)
    res.status(200)
    res.send({})
  })

  app.post('/order_player', (req, res) => {
    const { player, rightNeighbor, gameId } = req.body
    setPlayerOrder(gameId, player, rightNeighbor)
    res.status(200)
    res.send({})
  })

  app.post('/assign_roles', (req, res) => {
    const { roles, gameId } = req.body
    assignRoles(gameId, roles)
    res.status(200)
    res.send({})
  })

  app.post('/decide_fate', (req, res) => {
    const { player, gameId, dead } = req.body
    setPlayerFate(gameId, player, dead)
    res.status(200)
    res.send({})
  })

  app.post('/add_status_effect', (req, res) => {
    const { player, gameId, playerStatus } = req.body
    addPlayerStatus(gameId, player, playerStatus)
    res.status(200)
    res.send({})
  })

  app.post('/clear_status_effect', (req, res) => {
    const { player, gameId, playerStatusId } = req.body
    clearPlayerStatus(gameId, player, playerStatusId)
    res.status(200)
    res.send({})
  })

  app.post('/set_player_note', (req, res) => {
    const { me, noteworthyPlayer, gameId, note } = req.body
    setPlayerNote(gameId, me, noteworthyPlayer, note)
    res.status(200)
    res.send({})
  })

  app.post('/dead_vote', (req, res) => {
    const { player, gameId, voteUsed } = req.body
    toggleDeadvote(gameId, player, voteUsed)
    res.status(200)
    res.send({})
  })

  app.post('/manual_status', (req, res) => {
    const { gameId, status } = req.body
    updateStatus(gameId, status)
    res.status(200)
    res.send({})
  })

  app.post('/assign_role', (req, res) => {
    const { gameId, player, role } = req.body
    assignPlayerToRole(gameId, player, role)
    res.status(200)
    res.send({})
  })
  app.post('/set_alignment', (req, res) => {
    const { gameId, player, alignment } = req.body
    setAlignment(gameId, player, alignment)
    res.status(200)
    res.send({})
  })
}
