import { generate } from 'random-words'
import { type UnifiedGame, type BaseUnifiedGame, type UnifiedGameComputed, type GameStatus, type Role } from '@hidden-identity/shared'
import { getOrderedPlayers } from '../gameDB/seating.ts'
import { addScript, addTestScript } from '../scriptDB.ts'
import { WatchableResource, type Computer } from '../watchableResource.ts'
import { RemoteStorage, StoreFile } from '../remoteStorage.ts'

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
const storage = new StoreFile<BaseUnifiedGame>('game', new RemoteStorage())

export function gameInProgress (game: UnifiedGame): boolean {
  return game.gameStatus === 'Started' || game.gameStatus === 'Setup'
}

export async function gameExists (gameId: string): Promise<boolean> {
  if (gameDB[gameId]) return true

  const gameFromStorage = await storage.getFile(gameId)
  if (gameFromStorage) {
    gameDB[gameId] = new WatchableResource(gameFromStorage, gameComputer)
    gameDB[gameId].subscribe((value) => {
      storage.putFile(gameId, value as BaseUnifiedGame)
        .catch((e) => { console.error(e) })
    })
    return true
  }

  return false
}

export async function retrieveGame (gameId: string): Promise<WatchableGame> {
  if (!(await gameExists(gameId))) {
    throw new Error(`${JSON.stringify(gameId)} not found`)
  }

  return gameDB[gameId]
}

export async function getGame (gameId: string): Promise<UnifiedGame> {
  return (await retrieveGame(gameId)).readOnce()
}

export async function addGame (gameId: string): Promise<boolean> {
  console.log(`adding ${gameId}`)
  if (await gameExists(gameId)) {
    throw new Error('Game already exists')
  }

  gameDB[gameId] = new WatchableResource(createGame(), gameComputer)
  gameDB[gameId].subscribe((value) => {
    storage.putFile(gameId, value as BaseUnifiedGame)
      .catch((e) => { console.error(e) })
  })
  await addScript(gameId)

  return true
}

export async function addTestGame (gameId: string, game: BaseUnifiedGame): Promise<boolean> {
  console.log(`adding ${gameId}`)

  gameDB[gameId] = new WatchableResource(game, gameComputer)
  await addTestScript(gameId)

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
    roleBag: {},
    playersSeenRoles: [],
  }
}

export async function subscribeToGame (
  gameId: string,
  callback: (value: UnifiedGame | null) => void,
): Promise<() => void> {
  if (!(await gameExists(gameId))) {
    throw new Error(`${gameId} not found`)
  }

  return gameDB[gameId].subscribe(callback)
}

export async function updateStatus (gameId: string, status: GameStatus): Promise<void> {
  const game = await retrieveGame(gameId)
  const gameInstance = game.readOnce()

  game.update({
    ...gameInstance,
    gameStatus: status,
  })
}
