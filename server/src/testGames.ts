import { UNASSIGNED, addTestGame } from './database/gameDB/base.ts'
import { setScript } from './database/scriptDB.ts'
import { type Role } from './types/Role.ts'
import { type Script } from './types/Script.ts'
import { type BaseUnifiedGame } from './types/UnifiedGame.ts'

export function shuffleList<T> (list: readonly T[]): T[] {
  return [...list]
    .map((item) => [item, Math.random()] as const)
    .sort(([, order1], [, order2]) => order1 - order2)
    .map(([item]) => item)
}

export async function setupTestGames (): Promise<void> {
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
  await addGame('test-game', {
    gameStatus: 'PlayersJoining',
    gmSecretHash: 't',
    playersToRoles: Object.fromEntries(players.map(p => [p, UNASSIGNED])),
    deadPlayers: {},
    partialPlayerOrdering: Object.fromEntries(players.map((p, i) => [p, { rightNeighbor: players[(i + 1) % players.length] }])),
    playerPlayerStatuses: {
      alex: [{ type: 'poison', id: 'poison' }, { type: 'drunk', id: 'drunk' }, { type: 'custom', desc: 'I am the custom status effect', id: 'custom1' }],
    },
    playerNotes: {},
    deadVotes: {},
    travelers: {},
    alignmentsOverrides: {},
    roleBag: {},
    playersSeenRoles: [],
  })

  await addGame('tg-wrong-way', {
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
    playerPlayerStatuses: {
      alex: [{ type: 'poison', id: 'poison' }, { type: 'drunk', id: 'drunk' }, { type: 'custom', desc: 'I am the custom status effect', id: 'custom1' }],
    },
    playerNotes: {},
    deadVotes: {},
    travelers: {},
    alignmentsOverrides: {},
    roleBag: {},
    playersSeenRoles: [],
  })

  await addGame('tg-broken-link', {
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
    playerPlayerStatuses: {},
    playerNotes: {},
    deadVotes: {},
    travelers: {},
    alignmentsOverrides: {},
    roleBag: {},
    playersSeenRoles: [],
  })

  await addGame('tg-excluded', {
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
    playerPlayerStatuses: {},
    playerNotes: {},
    deadVotes: {},
    travelers: {},
    alignmentsOverrides: {},
    roleBag: {},
    playersSeenRoles: [],
  })

  await addGame('tg-f-night', ({
    gameStatus: 'Setup',
    gmSecretHash: 't',
    playersToRoles: Object.fromEntries(shuffleList(players).map((p, idx) => [p, tbScript[tbScript.length - idx - 1].id])),
    deadPlayers: {},
    partialPlayerOrdering: Object.fromEntries(players.map((p, i) => [p, { rightNeighbor: players[(i + 1) % players.length] }])),
    playerPlayerStatuses: {
      alex: [{ type: 'poison', id: 'poison' }, { type: 'drunk', id: 'drunk' }, { type: 'custom', desc: 'I am the custom status effect', id: 'custom1' }],
    },
    playerNotes: {},
    deadVotes: {},
    travelers: {},
    alignmentsOverrides: {},
    playersSeenRoles: [],
    roleBag: {},
  }))

  await addGame('tg-travelers', ({
    gameStatus: 'Setup',
    gmSecretHash: 't',
    playersToRoles: {
      ...Object.fromEntries(shuffleList(players)
        .map((p, idx) => [p, tbScript[tbScript.length - idx - 1].id])),
      'travelling billy': 'gunslinger' as Role,
    },
    deadPlayers: {},
    partialPlayerOrdering: Object.fromEntries(players.map((p, i) => [p, { rightNeighbor: players[(i + 1) % players.length] }])),
    playerPlayerStatuses: {
      alex: [{ type: 'poison', id: 'poison' }, { type: 'drunk', id: 'drunk' }, { type: 'custom', desc: 'I am the custom status effect', id: 'custom1' }],
    },
    playerNotes: {},
    deadVotes: {},
    travelers: {},
    alignmentsOverrides: {},
    roleBag: {},
  }))

  const selectorsPlayers = players.slice(0, testSelectorsScript.length)

  await addGame('tg-selectors', {
    gameStatus: 'Setup',
    gmSecretHash: 't',
    playersToRoles: Object.fromEntries(selectorsPlayers.map((p, idx) => [p, testSelectorsScript[testSelectorsScript.length - idx - 1].id])),
    deadPlayers: {},
    partialPlayerOrdering: Object.fromEntries(selectorsPlayers.map((p, i) => [p, { rightNeighbor: selectorsPlayers[(i + 1) % selectorsPlayers.length] }])),
    playerPlayerStatuses: {
      alex: [{ type: 'poison', id: 'poison' }, { type: 'drunk', id: 'drunk' }, { type: 'custom', desc: 'I am the custom status effect', id: 'custom1' }],
    },
    playerNotes: {},
    deadVotes: {},
    travelers: {},
    alignmentsOverrides: {},
    roleBag: {},
    playersSeenRoles: [],
  }, [...testSelectorsScript, { id: 'ravenkeeper' },
    { id: 'washerwoman' },
    { id: 'butler' }] as Script)
}

const tbScript = [
  { id: 'baron' },
  { id: 'chef' },
  { id: 'empath' },
  { id: 'fortune_teller' },
  { id: 'monk' },
  { id: 'virgin' },
  { id: 'slayer' },
  { id: 'soldier' },
  { id: 'mayor' },
  { id: 'librarian' },
  { id: 'investigator' },
  { id: 'undertaker' },
  { id: 'ravenkeeper' },
  { id: 'washerwoman' },
  { id: 'butler' },
  { id: 'recluse' },
  { id: 'saint' },
  { id: 'poisoner' },
  { id: 'spy' },
  { id: 'scarlet_woman' },
  { id: 'imp' }] as Script

const testSelectorsScript = [
  { id: 'riot' },
  { id: 'widow' },
  { id: 'cerenovus' },
  { id: 'undertaker' },
  { id: 'marionette' },
  { id: 'damsel' },
  { id: 'snitch' },
  { id: 'shabaloth' },
  { id: 'noble' },
  { id: 'mezepheles' }] as Script

async function addGame (name: string, game: BaseUnifiedGame, script: Script = tbScript): Promise<void> {
  await addTestGame(name, game)
  if (game.gameStatus !== 'PlayersJoining') {
    await setScript(name, script)
  }
}
