import { UNASSIGNED, addGame, computedValues } from './database/gameDB.ts'

export function setupTestGames (): void {
  addGame('test-game', computedValues({
    gameStarted: false,
    gmSecretHash: 't',
    playersToRoles: {
      linh: UNASSIGNED,
      alex: UNASSIGNED,
      tali: UNASSIGNED,
      elan: UNASSIGNED,
      joey: UNASSIGNED,
      jess: UNASSIGNED,

    },
    deadPlayers: {},
    partialPlayerOrdering: { alex: { rightNeighbor: 'tali' }, linh: { rightNeighbor: 'alex' }, jess: { rightNeighbor: 'linh' }, joey: { rightNeighbor: 'jess' }, elan: { rightNeighbor: 'joey' }, tali: { rightNeighbor: 'elan' } },
  }))

  addGame('tg-wrong-way', computedValues({
    gameStarted: false,
    gmSecretHash: 't',
    playersToRoles: {
      correct1: UNASSIGNED,
      correct2: UNASSIGNED,
      wrongway: UNASSIGNED,

    },
    partialPlayerOrdering: {
      correct1: { rightNeighbor: 'correct2' },
      correct2: { rightNeighbor: 'wrongway' },
      wrongway: { rightNeighbor: 'correct2' },
    },
    deadPlayers: {},
  }))

  addGame('tg-broken-link', computedValues({
    gameStarted: false,
    gmSecretHash: 't',
    playersToRoles: {
      excluded: UNASSIGNED,
      correct2: UNASSIGNED,
      brokenLink: UNASSIGNED,

    },
    partialPlayerOrdering: {
      excluded: { rightNeighbor: 'correct2' },
      correct2: { rightNeighbor: 'brokenLink' },
      brokenLink: null,
    },
    deadPlayers: {},
  }))
  addGame('tg-excluded', computedValues({
    gameStarted: false,
    gmSecretHash: 't',
    playersToRoles: {
      correct1: UNASSIGNED,
      correct2: UNASSIGNED,
      excluder: UNASSIGNED,
      excluded: UNASSIGNED,
    },
    partialPlayerOrdering: {
      correct1: { rightNeighbor: 'correct2' },
      correct2: { rightNeighbor: 'excluder' },
      excluder: { rightNeighbor: 'correct1' },
      excluded: { rightNeighbor: 'correct1' },
    },
    deadPlayers: {},
  }))
}
