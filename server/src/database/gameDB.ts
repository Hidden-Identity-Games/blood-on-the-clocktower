import { type Role, type UnifiedGame, type BrokenOrderedPlayers, type WellOrderedPlayers } from '../types/types.ts'
import { generate } from 'random-words'
import { WatchableResource } from './watchableResource.ts'
import { removeKey } from '../utils/objectUtils.ts'

const UNASSIGNED: Role = 'unassigned' as Role

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
      playersToRoles: {
        linh: UNASSIGNED,
        alex: UNASSIGNED,
        tali: UNASSIGNED,
        elan: UNASSIGNED,
        joey: UNASSIGNED,
        jess: UNASSIGNED,

      },
      partialPlayerOrdering: { alex: { rightNeighbor: 'tali' }, linh: { rightNeighbor: 'alex' }, jess: { rightNeighbor: 'linh' }, joey: { rightNeighbor: 'jess' }, elan: { rightNeighbor: 'joey' }, tali: { rightNeighbor: 'elan' } },
      orderedPlayers: { fullList: ['alex', 'linh', 'jess', 'joey', 'elan', 'tali'] },
    }
  }
  return {
    gameStarted: false,
    gmSecretHash: generate(3).join('-'),
    playersToRoles: {},
    partialPlayerOrdering: {},
    orderedPlayers: { fullList: [] },
  }
}

export function addPlayer (
  gameId: string,
  player: string,
): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  // player already exists
  if (gameInstance.playersToRoles[player]) {
    throw new Error(
      `Duplicate Playerid found: ${player}`,
    )
  }

  updateGameWithComputes(game, {
    ...gameInstance,
    partialPlayerOrdering: {
      ...gameInstance.partialPlayerOrdering,
      [player]: { rightNeighbor: null },
    },
    playersToRoles: {
      ...gameInstance.playersToRoles,
      [player]: UNASSIGNED,
    },
  })
}

export function kickPlayer (gameId: string, player: string): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  // player doesn't exist
  if (!gameInstance.playersToRoles[player]) {
    throw new Error(
      `Playerid not found: ${player}`,
    )
  }

  updateGameWithComputes(game, {
    ...gameInstance,
    playersToRoles: removeKey(gameInstance.playersToRoles, player),
  })
}

export function setPlayerOrder (
  gameId: string,
  player: string,
  rightNeighbor: string,
): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  updateGameWithComputes(game, { ...gameInstance, partialPlayerOrdering: { ...gameInstance.partialPlayerOrdering, [player]: { rightNeighbor } } })
}

function followGraph (players: UnifiedGame['partialPlayerOrdering']): string[] {
  let currentPlayer: string | null = Object.keys(players)[0]
  const chain: string[] = []
  while (currentPlayer) {
    chain.push(currentPlayer)
    const nextPlayer: string | null = players[currentPlayer]?.rightNeighbor ?? null
    if (nextPlayer && chain.includes(nextPlayer)) {
      return []
    }

    currentPlayer = nextPlayer
  }
  return chain
}

export function getOrderedPlayers (
  game: UnifiedGame,
): BrokenOrderedPlayers | WellOrderedPlayers {
  const players = Object.keys(game.playersToRoles)
  const fullList = followGraph(game.partialPlayerOrdering)
  if (fullList) {
    return { fullList }
  }
  // people who haven't chosen yet.
  const brokenLinks: BrokenOrderedPlayers['brokenLinks'] = players.filter((player) => game.partialPlayerOrdering[player]?.rightNeighbor)

  // people who are pointing at each other
  const spidermanPointing: BrokenOrderedPlayers['spidermanPointing'] = players.map((player) => {
    const neighbor = game.partialPlayerOrdering[player]?.rightNeighbor
    if (neighbor && game.partialPlayerOrdering[neighbor]?.rightNeighbor === player) {
      return [player, neighbor]
    }
    return null
  }).filter(Boolean) as Array<[string, string]>

  // set of people ointing at each other
  const excludedPlayers: BrokenOrderedPlayers['excludedPlayers'] = Object.fromEntries(players.map((player) => {
    return [player, players.filter(curr => game.partialPlayerOrdering[curr]?.rightNeighbor === player)] as const
  }))
  return { brokenLinks, spidermanPointing, excludedPlayers }
}

export function assignRoles (
  gameId: string,
  roles: Role[],
): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()
  const playerIdList = Object.keys(gameInstance.playersToRoles)

  updateGameWithComputes(game, {
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

function updateGameWithComputes (game: WatchableResource<UnifiedGame>, newValue: UnifiedGame): void {
  newValue.orderedPlayers = getOrderedPlayers(newValue)
  game.update(newValue)
}
