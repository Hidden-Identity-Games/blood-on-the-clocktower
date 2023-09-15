import { UNASSIGNED, addGame } from './database/gameDB.ts'

export function setupTestGames (): void {
  const players = [
    'linh',
    'alex',
    'tali',
    'elan',
    'joey',
    'jess',
    'kennedy',
    'auden',
    'maria',
    'victoria',
    'mrinal',
    'patrick',
    'nadir',
    'cameron',
  ]
  addGame('test-game', {
    gameStatus: 'PlayersJoining',
    gmSecretHash: 't',
    playersToRoles: Object.fromEntries(players.map(p => [p, UNASSIGNED])),
    deadPlayers: {},
    partialPlayerOrdering: Object.fromEntries(players.map((p, i) => [p, { rightNeighbor: players[(i + 1) % players.length] }])),
    playerNotes: {
      alex: [{ type: 'poison', id: 'poison' }, { type: 'drunk', id: 'drunk' }, { type: 'bluffing', id: 'bluff_1', as: 'Demon' }, { type: 'custom', message: 'look at me!', id: 'custom1' }],
    },
    deadVotes: {},
  })

  addGame('tg-wrong-way', {
    gameStatus: 'PlayersJoining',
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
    playerNotes: {
      alex: [{ type: 'poison', id: 'poison' }, { type: 'drunk', id: 'drunk' }, { type: 'bluffing', id: 'bluff_1', as: 'Demon' }, { type: 'custom', message: 'look at me!', id: 'custom1' }],
    },
    deadVotes: {},
  })

  addGame('tg-broken-link', {
    gameStatus: 'PlayersJoining',
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
    playerNotes: {},
    deadVotes: {},
  })
  addGame('tg-excluded', {
    gameStatus: 'PlayersJoining',
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
    playerNotes: {},
    deadVotes: {},
  })
}
