import { type Neighbors, type UnifiedGame } from '../types/types.ts'
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
      players: ['linh', 'alex', 'tali', 'elan', 'joey', 'jess'],
      playersToRoles: {},
      partialPlayerOrdering: { alex: { leftNeighbor: 'linh', rightNeighbor: 'tali' }, linh: { leftNeighbor: 'jess', rightNeighbor: 'alex' }, jess: { leftNeighbor: 'joey', rightNeighbor: 'linh' }, joey: { leftNeighbor: 'elan', rightNeighbor: 'jess' }, elan: { leftNeighbor: 'tali', rightNeighbor: 'joey' }, tali: { leftNeighbor: 'alex', rightNeighbor: 'elan' } },
      orderedPlayers: ['alex', 'linh', 'jess', 'joey', 'elan', 'tali'],
    }
  }
  return {
    gameStarted: false,
    gmSecretHash: generate(3).join('-'),
    players: [],
    playersToRoles: {},
    partialPlayerOrdering: {},
    orderedPlayers: [],
  }
}

export function addPlayer (
  gameId: string,
  player: string,
): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  // player name taken
  if (gameInstance.players.includes(player)) {
    throw new Error(`Name taken: ${player}`)
  }

  updateGameWithComputes(game, {
    ...gameInstance,
    players: [
      ...gameInstance.players,
      player,
    ],
  })
}

export function kickPlayer (gameId: string, player: string): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  // player doesn't exist
  if (!gameInstance.players.includes(player)) {
    throw new Error(
      `Player not found: ${player}`,
    )
  }
  const nextPlayerNames = [
    ...gameInstance.players,
  ]
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  const indexOf = nextPlayerNames.indexOf(player)
  nextPlayerNames.splice(indexOf)

  const nextPlayerRoles = {
    ...gameInstance.playersToRoles,
  }
  if (Reflect.has(nextPlayerRoles, player)) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete nextPlayerRoles[player]
  }

  updateGameWithComputes(game, {
    ...gameInstance,
    players: nextPlayerNames,
    playersToRoles: nextPlayerRoles,
  })
}

export function setPlayerOrder (
  gameId: string,
  player: string,
  leftNeighbor: string,
  rightNeighbor: string,
): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  updateGameWithComputes(game, { ...gameInstance, partialPlayerOrdering: { ...gameInstance.partialPlayerOrdering, [player]: { leftNeighbor, rightNeighbor } } })
}

export function getOrderedPlayers (
  playerOrderSnippets: Record<string, Neighbors>,
): string[] {
  const playerKeys = Object.keys(playerOrderSnippets ?? {})
  if (!playerKeys[0]) return []
  return getOrderedPlayersRecurse(playerOrderSnippets, [playerKeys[0]])
}

function getOrderedPlayersRecurse (
  playerOrderSnippets: Record<string, Neighbors>,
  ordered: string[],
): string[] {
  if (ordered.length === Object.keys(playerOrderSnippets).length) { return ordered }

  const nextPlayer = playerOrderSnippets[ordered[ordered.length - 1]].leftNeighbor
  if (ordered.includes(nextPlayer)) throw new Error('Players formed sub-loop.')

  return getOrderedPlayersRecurse(playerOrderSnippets, [
    ...ordered,
    nextPlayer,
  ])
}

export function assignRoles (
  gameId: string,
  roles: string[],
): string | undefined {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  // player already exists
  if (gameInstance.players.length !== roles.length) {
    return `Player count does not match role count players ${JSON.stringify(
      gameInstance.players,
    )}, roles:${JSON.stringify(roles)}.`
  }

  updateGameWithComputes(game, {
    ...gameInstance,
    gameStarted: true,
    playersToRoles: roles
      .map((item) => ({ item, random: Math.random() }))
      .sort((a, b) => a.random - b.random)
      .map((element) => element.item)
      .reduce<Record<string, string>>(
      (acc, item, idx) => ({
        ...acc,
        [gameInstance.players[idx]]: item,
      }),
      {},
    ),
  })
}

function updateGameWithComputes (game: WatchableResource<UnifiedGame>, newValue: UnifiedGame): void {
  newValue.orderedPlayers = getOrderedPlayers(newValue.partialPlayerOrdering)
  game.update(newValue)
}
