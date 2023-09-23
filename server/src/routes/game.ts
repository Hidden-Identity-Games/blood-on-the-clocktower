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

export async function useGame (app: Application): Promise<void> {
  await setupTestGames()
  app.post('/game', (req, res) => {
    const { hash: gameId, oldGameId } = req.body

    if (oldGameId) {
      console.log(`recieved old gameID: ${oldGameId}, updating old game`)

      retrieveGame(oldGameId).then((oldGame) => {
        oldGame.update({
          ...oldGame.readOnce(),
          nextGameId: gameId,
        })
      }, () => { throw new Error(`Failed to update client of old game '${gameId}' with new gameId`) })
    }
    console.log(`creating new game ${gameId}`)
    addGame(gameId).then(async () => {
      const game = await getGame(gameId)
      console.log(`Game created ${gameId}`)
      console.log(`responding with: ${JSON.stringify(game)}`)
      res.send(game)
    }, () => { throw new Error(`Failed to create new game ${gameId}`) })
  })

  app.get('/game/:gameId', (_req, res) => {
    const gameId = _req.params.gameId
    getGame(gameId).then((game) => {
      if (!game) {
        res.status(404)
      }
      res.send(game)
    }, () => { throw new Error(`Failed to retrieve game ${gameId}`) })
  })

  app.post('/add_player', (req, res) => {
    const { player, gameId } = req.body
    addPlayer(gameId, player).then(() => {
      res.status(200)
      res.send({
        player,
      })
    }, () => { throw new Error(`Failed to add player ${player} to ${gameId}`) })
  })

  app.post('/kick_player', (req, res) => {
    const { player, gameId } = req.body
    kickPlayer(gameId, player).then(() => {
      res.status(200)
      res.send({})
    }, () => { throw new Error(`Failed to kick player ${player} from ${gameId}`) })
  })

  app.post('/order_player', (req, res) => {
    const { player, rightNeighbor, gameId } = req.body
    setPlayerOrder(gameId, player, rightNeighbor).then(() => {
      res.status(200)
      res.send({})
    }, () => { throw new Error(`Failed to add neighbor of ${player} to ${gameId}`) })
  })

  app.post('/assign_roles', (req, res) => {
    const { roles, gameId } = req.body
    assignRoles(gameId, roles).then(() => {
      res.status(200)
      res.send({})
    }, () => { throw new Error(`Failed to assign roles to ${gameId}`) })
  })

  app.post('/decide_fate', (req, res) => {
    const { player, gameId, dead } = req.body
    setPlayerFate(gameId, player, dead).then(() => {
      res.status(200)
      res.send({})
    }, () => { throw new Error(`Failed to decide fate of ${player} on ${gameId}`) })
  })

  app.post('/add_status_effect', (req, res) => {
    const { player, gameId, playerStatus } = req.body
    addPlayerStatus(gameId, player, playerStatus).then(() => {
      res.status(200)
      res.send({})
    }, () => { throw new Error(`Failed to add status to ${player} on ${gameId}`) })
  })

  app.post('/clear_status_effect', (req, res) => {
    const { player, gameId, playerStatusId } = req.body
    clearPlayerStatus(gameId, player, playerStatusId).then(() => {
      res.status(200)
      res.send({})
    }, () => { throw new Error(`Failed to clear status ${playerStatusId} from ${player} on ${gameId}`) })
  })

  app.post('/set_player_note', (req, res) => {
    const { player, gameId, note } = req.body
    setPlayerNote(gameId, player, note).then(() => {
      res.status(200)
      res.send({})
    }, () => { throw new Error(`Failed to asign note to ${player} on ${gameId}`) })
  })

  app.post('/dead_vote', (req, res) => {
    const { player, gameId, voteUsed } = req.body
    toggleDeadvote(gameId, player, voteUsed).then(() => {
      res.status(200)
      res.send({})
    }, () => { throw new Error(`Failed to toggle dead vote of ${player} on ${gameId}`) })
  })

  app.post('/manual_status', (req, res) => {
    const { gameId, status } = req.body
    updateStatus(gameId, status).then(() => {
      res.status(200)
      res.send({})
    }, () => { throw new Error(`Failed to add manual status to ${gameId}`) })
  })

  app.post('/assign_role', (req, res) => {
    const { gameId, player, role } = req.body
    assignPlayerToRole(gameId, player, role).then(() => {
      res.status(200)
      res.send({})
    }, () => { throw new Error(`Failed to assign role to ${player} on ${gameId}`) })
  })
  app.post('/set_alignment', (req, res) => {
    const { gameId, player, alignment } = req.body
    setAlignment(gameId, player, alignment).then(() => {
      res.status(200)
      res.send({})
    }, () => { throw new Error(`Failed to set alignment of ${player} on ${gameId}`) })
  })
}
