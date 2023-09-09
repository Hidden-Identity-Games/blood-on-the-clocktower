import { type Role, type UnifiedGame } from '../types/types.ts'
import { generate } from 'random-words'
import { WatchableResource } from './watchableResource.ts'

const gameDB: Record<string, WatchableResource<UnifiedGame>> = {}

export function gameExists (gameId: string): boolean {
  return !!gameDB[gameId]
}

export function retrieveGame (gameId: string): WatchableResource<UnifiedGame> {
  if (!gameExists(gameId)) {
    throw new Error(`${JSON.stringify(gameId)} not found`)
  }

  return gameDB[gameId]
}

export function getGame (gameId: string): UnifiedGame {
  return retrieveGame(gameId).readOnce()
}

export function addGame (gameId: string): boolean {
  if (gameExists(gameId)) {
    throw new Error('Game already exists')
  }

  gameDB[gameId] = new WatchableResource(createGame(gameId))
  return true
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

function createGame (gameId: string): UnifiedGame {
  if (gameId === 'test-game') {
    return {
      gameStarted: false,
      gmSecretHash: gameId,
      playersToNames: { 1: 'linh', 2: 'alex', 3: 'tali', 4: 'elan', 5: 'joey', 6: 'jess' },
      playersToRoles: {},
    }
  }
  return {
    gameStarted: false,
    gmSecretHash: generate(3).join('-'),
    playersToNames: {},
    playersToRoles: {},
  }
}

export function addPlayer (
  gameId: string,
  playerId: string,
  playerName: string,
): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  // player already exists
  if (gameInstance.playersToNames[playerId]) {
    throw new Error(
      `Duplicate Playerid found: ${playerId}, name: ${playerName}`,
    )
  }

  // player name taken
  if (gameInstance.playersToNames[playerId]) {
    throw new Error(`Name taken: ${playerName}`)
  }

  game.update({
    ...gameInstance,
    playersToNames: {
      ...gameInstance.playersToNames,
      [playerId]: playerName,
    },
  })
}

export function kickPlayer (gameId: string, playerId: string): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  // player doesn't exist
  if (!gameInstance.playersToNames[playerId]) {
    throw new Error(
      `Playerid not found: ${playerId}`,
    )
  }
  const nextPlayerNames = {
    ...gameInstance.playersToNames,
  }
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete nextPlayerNames[playerId]

  const nextPlayerRoles = {
    ...gameInstance.playersToRoles,
  }
  if (Reflect.has(nextPlayerRoles, playerId)) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete nextPlayerRoles[playerId]
  }

  game.update({
    ...gameInstance,
    playersToNames: nextPlayerNames,
    playersToRoles: nextPlayerRoles,
  })
}
export function assignRoles (
  gameId: string,
  roles: Role[],
): string | undefined {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()
  const playerIdList = Object.keys(gameInstance.playersToNames)

  // player already exists
  if (playerIdList.length !== roles.length) {
    return `Player count does not match role count players${JSON.stringify(
      Object.values(gameInstance.playersToNames),
    )}, roles:${JSON.stringify(roles)}.`
  }

  game.update({
    ...gameInstance,
    gameStarted: true,
    playersToRoles: roles
      .map((item) => ({ item, random: Math.random() }))
      .sort((a, b) => a.random - b.random)
      .map((element) => element.item)
      .reduce<Record<string, Role>>(
      (acc, item, idx) => ({
        ...acc,
        [playerIdList[idx]]: item,
      }),
      {},
    ),
  })
}
