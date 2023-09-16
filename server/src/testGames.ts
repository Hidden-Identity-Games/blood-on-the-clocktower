import { UNASSIGNED, addGame } from './database/gameDB.ts'
import { setScript } from './database/scriptDB.ts'
import { type Script } from './types/Script.ts'
import { type BaseUnifiedGame } from './types/UnifiedGame.ts'

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
  addTestGame('test-game', {
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

  addTestGame('tg-wrong-way', {
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

  addTestGame('tg-broken-link', {
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
  addTestGame('tg-excluded', {
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

  addTestGame('tg-f-night', ({
    gameStatus: 'Setup',
    gmSecretHash: 't',
    playersToRoles: Object.fromEntries(players.map((p, idx) => [p, tbScript[tbScript.length - idx - 1].id])),
    deadPlayers: {},
    partialPlayerOrdering: Object.fromEntries(players.map((p, i) => [p, { rightNeighbor: players[(i + 1) % players.length] }])),
    playerNotes: {
      alex: [{ type: 'poison', id: 'poison' }, { type: 'drunk', id: 'drunk' }, { type: 'bluffing', id: 'bluff_1', as: 'Demon' }, { type: 'custom', message: 'look at me!', id: 'custom1' }],
    },
    deadVotes: {},
  }))
}

const tbScript = [
  { id: 'baron' },
  { id: 'chef' },
  { id: 'empath' },
  { id: 'fortune_teller' },
  { id: 'undertaker' },
  { id: 'monk' },
  { id: 'virgin' },
  { id: 'slayer' },
  { id: 'soldier' },
  { id: 'mayor' },
  { id: 'librarian' },
  { id: 'investigator' },
  { id: 'ravenkeeper' },
  { id: 'washerwoman' },
  { id: 'butler' },
  { id: 'recluse' },
  { id: 'saint' },
  { id: 'poisoner' },
  { id: 'spy' },
  { id: 'scarlet_woman' },
  { id: 'imp' }] as Script

function addTestGame (name: string, game: BaseUnifiedGame): void {
  addGame(name, game)
  if (game.gameStatus !== 'PlayersJoining') {
    setScript(name, tbScript)
  }
}
