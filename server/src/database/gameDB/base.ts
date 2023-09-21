import { generate } from 'random-words'
import { type Role } from '../../types/Role.ts'
import { type UnifiedGame, type BaseUnifiedGame, type UnifiedGameComputed, type GameStatus } from '../../types/UnifiedGame.ts'
import { getOrderedPlayers } from '../gameDB/seating.ts'
import { addScript } from '../scriptDB.ts'
import { WatchableResource, type Computer } from '../watchableResource.ts'

export const UNASSIGNED: Role = 'unassigned' as Role

const gameComputer: Computer<BaseUnifiedGame, UnifiedGameComputed> = {
  orderedPlayers: getOrderedPlayers,
  playerList: (game) => Object.keys(game.playersToRoles).sort(),
  rolesToPlayers: (game) => {
    const rolesToPlayers: Record<Role, string[]> = {}
    Object.entries(game.playersToRoles).forEach(([player, role]) => {
      rolesToPlayers[role] = [...(rolesToPlayers[role] || []), player]
    })
    return rolesToPlayers
  },
}

type WatchableGame = WatchableResource<BaseUnifiedGame, UnifiedGameComputed>

const gameDB: Record<string, WatchableGame> = {}

export function gameInProgress (game: UnifiedGame): boolean {
  return game.gameStatus === 'Started' || game.gameStatus === 'Setup'
}

export function gameExists (gameId: string): boolean {
  return !!gameDB[gameId]
}

export function retrieveGame (gameId: string): WatchableGame {
  if (!gameExists(gameId)) {
    throw new Error(`${JSON.stringify(gameId)} not found`)
  }

  return gameDB[gameId]
}

export function getGame (gameId: string): UnifiedGame {
  return retrieveGame(gameId).readOnce()
}

export function addGame (gameId: string, game?: BaseUnifiedGame): boolean {
  console.log(`adding ${gameId}`)
  if (gameExists(gameId)) {
    throw new Error('Game already exists')
  }

  gameDB[gameId] = new WatchableResource(game ?? createGame(), gameComputer)
  addScript(gameId)

  return true
}

function createGame (): BaseUnifiedGame {
  return {
    gameStatus: 'PlayersJoining',
    gmSecretHash: generate(3).join('-'),
    playersToRoles: {},
    partialPlayerOrdering: {},
    deadPlayers: {},
    playerPlayerStatuses: {},
    playerNotes: {},
    deadVotes: {},
    travelers: {},
    alignmentsOverrides: {},
  }
}

export function subscribeToGame (
  gameId: string,
  callback: (value: UnifiedGame | null) => void,
): () => void {
  if (!gameExists(gameId)) {
    throw new Error(`${gameId} not found`)
  }

  return gameDB[gameId].subscribe(callback)
}

export function updateStatus (gameId: string, status: GameStatus): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  game.update({
    ...gameInstance,
    gameStatus: status,
  })
}
