import { type Role, type UnifiedGame, type BrokenOrderedPlayers, type WellOrderedPlayers, type Problem, type BaseUnifiedGame, type Note, type GameStatus, type Script } from '../types/UnifiedGame.ts'
import { generate } from 'random-words'
import { WatchableResource } from './watchableResource.ts'
import { removeKey } from '../utils/objectUtils.ts'

export const UNASSIGNED: Role = 'unassigned' as Role

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

export function addGame (gameId: string, game?: UnifiedGame): boolean {
  if (gameExists(gameId)) {
    throw new Error('Game already exists')
  }

  gameDB[gameId] = new WatchableResource(game ?? createGame())
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

function createGame (): UnifiedGame {
  return {
    gameStatus: 'PlayersJoining',
    gmSecretHash: generate(3).join('-'),
    playersToRoles: {},
    partialPlayerOrdering: {},
    orderedPlayers: { fullList: [], problems: false },
    deadPlayers: {},
    playerNotes: {},
    deadVotes: {},
  }
}

export function setScript (gameId: string, script: Script): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  updateGameWithComputes(game, { ...gameInstance, script })
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
    deadPlayers: {
      ...gameInstance.deadPlayers,
      [player]: false,
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
    partialPlayerOrdering: removeKey(gameInstance.partialPlayerOrdering, player),
  })
}

export function setPlayerFate (
  gameId: string,
  player: string,
  dead: boolean,
): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  updateGameWithComputes(game, { ...gameInstance, deadPlayers: { ...gameInstance.deadPlayers, [player]: dead } })
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
export function computedValues (game: Omit<UnifiedGame, 'orderedPlayers'>): UnifiedGame {
  return {
    ...game,
    orderedPlayers: getOrderedPlayers(game),
  }
}

function followGraph (players: UnifiedGame['partialPlayerOrdering']): string[] {
  const allPlayers = Object.keys(players)
  let currentPlayer: string | null = allPlayers[0]
  const chain: string[] = []
  while (currentPlayer && !chain.includes(currentPlayer)) {
    chain.push(currentPlayer)
    const nextPlayer: string | null = players[currentPlayer]?.rightNeighbor ?? null
    if (!nextPlayer) {
      return []
    }
    currentPlayer = nextPlayer
  }

  if (chain.length === allPlayers.length && players[chain[chain.length - 1]]?.rightNeighbor === chain[0]) {
    return chain
  }
  return []
}

function getProblems (game: BaseUnifiedGame, player: string): Problem | null {
  const neighbor = game.partialPlayerOrdering[player]?.rightNeighbor
  if (!neighbor) {
    return { type: 'broken-link' }
  }

  // if you're pointing at the person who is pointing at you
  if (game.partialPlayerOrdering[neighbor]?.rightNeighbor === player) {
    return ({ type: 'spiderman' })
  }

  const chosenPlayers = Object.values(game.partialPlayerOrdering).map(neighbors => neighbors?.rightNeighbor).filter(Boolean)
  if (
    // If nobody is pointing at you yet.
    chosenPlayers.filter(p => p === player).length !== 0 &&
    // you're pointing at the same person as someone else.
    chosenPlayers.filter(n => n === neighbor).length > 1) {
    // if you've been chosen, and you have a duplicate choice, you're an excluder
    return ({ type: 'excluder' })
  }

  return null
}

export function getOrderedPlayers (
  game: BaseUnifiedGame,
): BrokenOrderedPlayers | WellOrderedPlayers {
  const players = Object.keys(game.playersToRoles)
  const fullList = followGraph(game.partialPlayerOrdering)
  console.log(fullList)
  if (fullList.length === players.length) {
    return { fullList, problems: false }
  }

  return {
    problems: true,
    playerProblems: players.reduce<Record<string, Problem | null>>((problemMap, player) => {
      return {
        ...problemMap,
        [player]: getProblems(game, player),
      }
    }, {}),
  }
}

export function assignRoles (
  gameId: string,
  roles: Role[],
): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()
  const playerIdList = Object.keys(gameInstance.playersToRoles)
  if (playerIdList.length !== roles.length) {
    throw new Error(`Player role count mistmatch, ${playerIdList.length} players, ${roles.length} roles.`)
  }

  updateGameWithComputes(game, {
    ...gameInstance,
    gameStatus: 'Setup',
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

export function addNote (gameId: string, player: string, note: Note): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  updateGameWithComputes(game, {
    ...gameInstance,
    playerNotes: {
      ...gameInstance.playerNotes,
      [player]: [...(gameInstance.playerNotes[player] || []), note],
    },
  })
}
export function clearNote (gameId: string, player: string, noteId: string): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()
  console.log(noteId, gameInstance.playerNotes[player])

  updateGameWithComputes(game, {
    ...gameInstance,
    playerNotes: {
      ...gameInstance.playerNotes,
      [player]: [
        ...(gameInstance.playerNotes[player] || []).filter(({ id }) => id !== noteId),
      ],
    },
  })
}
export function toggleDeadvote (gameId: string, player: string, voteUsed: boolean): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  updateGameWithComputes(game, {
    ...gameInstance,
    deadVotes: {
      ...gameInstance.deadVotes,
      [player]: voteUsed,
    },
  })
}

export function updateStatus (gameId: string, status: GameStatus): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  updateGameWithComputes(game, {
    ...gameInstance,
    gameStatus: status,
  })
}

function updateGameWithComputes (game: WatchableResource<UnifiedGame>, newValue: UnifiedGame): void {
  newValue.orderedPlayers = getOrderedPlayers(newValue)
  game.update(newValue)
}
