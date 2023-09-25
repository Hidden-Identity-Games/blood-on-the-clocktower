import { type Role, type Alignment } from '../../types/Role.ts'
import { type PlayerStatus } from '../../types/UnifiedGame.ts'
import { removeKey } from '../../utils/objectUtils.ts'
import { UNASSIGNED, gameInProgress, retrieveGame } from './base.ts'

export async function addPlayer (
  gameId: string,
  player: string,
  traveler?: boolean,
): Promise<void> {
  const game = await retrieveGame(gameId)
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

export async function kickPlayer (gameId: string, player: string): Promise<void> {
  const game = await retrieveGame(gameId)
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

export async function setPlayerFate (
  gameId: string,
  player: string,
  dead: boolean,
): Promise<void> {
  const game = await retrieveGame(gameId)
  const gameInstance = game.readOnce()

  game.update({ ...gameInstance, deadPlayers: { ...gameInstance.deadPlayers, [player]: dead } })
}

export async function setPlayerOrder (
  gameId: string,
  player: string,
  rightNeighbor: string | null,
): Promise<void> {
  const game = await retrieveGame(gameId)
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

export async function addPlayerStatus (gameId: string, player: string, playerStatus: PlayerStatus): Promise<void> {
  const game = await retrieveGame(gameId)
  const gameInstance = game.readOnce()

  game.update({
    ...gameInstance,
    playerPlayerStatuses: {
      ...gameInstance.playerPlayerStatuses,
      [player]: [...(gameInstance.playerPlayerStatuses[player] || []), playerStatus],
    },
  })
}

export async function clearPlayerStatus (gameId: string, player: string, playerStatusId: string): Promise<void> {
  const game = await retrieveGame(gameId)
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

export async function setPlayerNote (gameId: string, player: string, note: string): Promise<void> {
  const game = await retrieveGame(gameId)
  const gameInstance = game.readOnce()

  game.update({
    ...gameInstance,
    playerNotes: {
      ...gameInstance.playerNotes,
      [player]: note,
    },
  })
}

export async function toggleDeadvote (gameId: string, player: string, voteUsed: boolean): Promise<void> {
  const game = await retrieveGame(gameId)
  const gameInstance = game.readOnce()

  game.update({
    ...gameInstance,
    deadVotes: {
      ...gameInstance.deadVotes,
      [player]: voteUsed,
    },
  })
}

export async function setAlignment (gameId: string, player: string, alignment: Alignment): Promise<void> {
  const game = await retrieveGame(gameId)
  const gameInstance = game.readOnce()

  game.update({
    ...gameInstance,
    alignmentsOverrides: {
      ...gameInstance.alignmentsOverrides,
      [player]: alignment,
    },
  })
}

export async function assignRoles (
  gameId: string,
  roles: Role[],
): Promise<void> {
  const game = await retrieveGame(gameId)
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
