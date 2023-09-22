import { type Role, type UnifiedGame, type BrokenOrderedPlayers, type WellOrderedPlayers, type Problem, type BaseUnifiedGame, type PlayerStatus, type GameStatus, type UnifiedGameComputed, type Alignment } from '../types/index.ts'
import { generate } from 'random-words'
import { type Computer, WatchableResource } from './watchableResource.ts'
import { removeKey } from '../utils/objectUtils.ts'
import { addScript } from './scriptDB.ts'
import { RemoteStorage, StorageObject } from './remoteStorage.ts'

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

function gameInProgress (game: UnifiedGame): boolean {
  return game.gameStatus === 'Started' || game.gameStatus === 'Setup'
}

export async function addGame (gameId: string, game?: BaseUnifiedGame): Promise<boolean> {
  console.log(`adding ${gameId}`)
  if (gameExists(gameId)) {
    throw new Error('Game already exists')
  }

  const storage = new StorageObject<BaseUnifiedGame>('game', gameId, new RemoteStorage())
  gameDB[gameId] = new WatchableResource(game ?? await storage.getFile() ?? createGame(), gameComputer, storage)
  addScript(gameId)

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

export function addPlayer (
  gameId: string,
  player: string,
  traveler?: boolean,
): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()
  const gameStarted = gameInProgress(gameInstance)
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const traveling = traveler || gameStarted

  // player already exists
  if (gameInstance.playersToRoles[player]) {
    throw new Error(
      `Duplicate Playerid found: ${player}`,
    )
  }

  game.update({
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
    travelers: {
      ...gameInstance.travelers,
      ...(traveling && { [player]: true }),
    },
    alignmentsOverrides: {
      ...gameInstance.alignmentsOverrides,
      // default to good so there's never a character without alignment.
      ...(traveling && { [player]: 'Good' }),
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

  game.update({
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

  game.update({ ...gameInstance, deadPlayers: { ...gameInstance.deadPlayers, [player]: dead } })
}

export function setPlayerOrder (
  gameId: string,
  player: string,
  rightNeighbor: string,
): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()
  const gameStarted = gameInProgress(gameInstance)

  if (gameStarted) {
    const leftNeighbor = Object.keys(gameInstance.partialPlayerOrdering).find(p => gameInstance.partialPlayerOrdering[p]?.rightNeighbor === player)
    if (!leftNeighbor) {
      throw new Error(`Cannot find player on left for ${player}, ${rightNeighbor}, ${JSON.stringify(gameInstance.partialPlayerOrdering)}`)
    }
    game.update({
      ...gameInstance,
      ...gameInstance,
      partialPlayerOrdering: {
        ...gameInstance.partialPlayerOrdering,
        [player]: { rightNeighbor },
        [leftNeighbor]: { rightNeighbor: player },
      },
    })
  } else {
    game.update({
      ...gameInstance,
      partialPlayerOrdering: {
        ...gameInstance.partialPlayerOrdering,
        [player]: { rightNeighbor },
      },
    })
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
  if (!(neighbor && game.playersToRoles[neighbor])) {
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
export function assignPlayerToRole (gameId: string, player: string, role: Role): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()
  game.update({
    ...gameInstance,
    playersToRoles: {
      ...gameInstance.playersToRoles,
      [player]: role,
    },
  })
}

export function assignRoles (
  gameId: string,
  roles: Role[],
): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()
  const playerIdList = gameInstance.playerList
  if (playerIdList.length !== roles.length) {
    throw new Error(`Player role count mistmatch, ${playerIdList.length} players, ${roles.length} roles.`)
  }

  game.update({
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

export function addPlayerStatus (gameId: string, player: string, playerStatus: PlayerStatus): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  game.update({
    ...gameInstance,
    playerPlayerStatuses: {
      ...gameInstance.playerPlayerStatuses,
      [player]: [...(gameInstance.playerPlayerStatuses[player] || []), playerStatus],
    },
  })
}

export function clearPlayerStatus (gameId: string, player: string, playerStatusId: string): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  game.update({
    ...gameInstance,
    playerPlayerStatuses: {
      ...gameInstance.playerPlayerStatuses,
      [player]: [
        ...(gameInstance.playerPlayerStatuses[player] || []).filter(({ id }) => id !== playerStatusId),
      ],
    },
  })
}

export function setPlayerNote (gameId: string, player: string, note: string): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  game.update({
    ...gameInstance,
    playerNotes: {
      ...gameInstance.playerNotes,
      [player]: note,
    },
  })
}

export function toggleDeadvote (gameId: string, player: string, voteUsed: boolean): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  game.update({
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

  game.update({
    ...gameInstance,
    gameStatus: status,
  })
}

export function setAlignment (gameId: string, player: string, alignment: Alignment): void {
  const game = retrieveGame(gameId)
  const gameInstance = game.readOnce()

  game.update({
    ...gameInstance,
    alignmentsOverrides: {
      ...gameInstance.alignmentsOverrides,
      [player]: alignment,
    },
  })
}
