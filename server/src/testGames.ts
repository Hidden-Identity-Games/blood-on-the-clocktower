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
  }))

  addGame('tg-broken-link', computedValues({
    gameStarted: false,
    gmSecretHash: 't',
    playersToRoles: {
      correct1: UNASSIGNED,
      correct2: UNASSIGNED,
      notYetChosen: UNASSIGNED,

    },
    partialPlayerOrdering: {
      correct1: { rightNeighbor: 'correct2' },
      correct2: { rightNeighbor: 'notYetChosen' },
      notYetChosen: null,
    },
  }))
  addGame('tg-excluded', computedValues({
    gameStarted: false,
    gmSecretHash: 't',
    playersToRoles: {
      correct1: UNASSIGNED,
      correct2: UNASSIGNED,
      skipper: UNASSIGNED,
      skipped: UNASSIGNED,

    },
    partialPlayerOrdering: {
      correct1: { rightNeighbor: 'correct2' },
      correct2: { rightNeighbor: 'skipper' },
      skipper: { rightNeighbor: 'correct1' },
      skipped: { rightNeighbor: 'correct1' },
    },
  }))
}
