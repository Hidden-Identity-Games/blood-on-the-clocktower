import {
  type Role,
  type BaseUnifiedGame,
  type BrokenOrderedPlayers,
  type Problem,
  type WellOrderedPlayers,
  type UnifiedGame,
} from "@hidden-identity/shared";
import { retrieveGame } from "./base.ts";

function followGraph(players: UnifiedGame["partialPlayerOrdering"]): string[] {
  const allPlayers = Object.keys(players);
  let currentPlayer: string | null = allPlayers[0];
  const chain: string[] = [];
  while (currentPlayer && !chain.includes(currentPlayer)) {
    chain.push(currentPlayer);
    const nextPlayer: string | null =
      players[currentPlayer]?.rightNeighbor ?? null;
    if (!nextPlayer) {
      return [];
    }
    currentPlayer = nextPlayer;
  }

  if (
    chain.length === allPlayers.length &&
    players[chain[chain.length - 1]]?.rightNeighbor === chain[0]
  ) {
    return chain;
  }
  return [];
}

function getProblems(game: BaseUnifiedGame, player: string): Problem | null {
  const neighbor = game.partialPlayerOrdering[player]?.rightNeighbor;
  if (!(neighbor && game.playersToRoles[neighbor])) {
    return { type: "broken-link" };
  }

  // if you're pointing at the person who is pointing at you
  if (game.partialPlayerOrdering[neighbor]?.rightNeighbor === player) {
    return { type: "spiderman" };
  }

  const chosenPlayers = Object.values(game.partialPlayerOrdering)
    .map((neighbors) => neighbors?.rightNeighbor)
    .filter(Boolean);
  if (
    // If nobody is pointing at you yet.
    chosenPlayers.filter((p) => p === player).length !== 0 &&
    // you're pointing at the same person as someone else.
    chosenPlayers.filter((n) => n === neighbor).length > 1
  ) {
    // if you've been chosen, and you have a duplicate choice, you're an excluder
    return { type: "excluder" };
  }

  return null;
}

export function getOrderedPlayers(
  game: BaseUnifiedGame,
): BrokenOrderedPlayers | WellOrderedPlayers {
  const players = Object.keys(game.playersToRoles);
  const fullList = followGraph(game.partialPlayerOrdering);
  if (fullList.length === players.length) {
    return { fullList, problems: false };
  }

  return {
    problems: true,
    playerProblems: players.reduce<Record<string, Problem | null>>(
      (problemMap, player) => {
        return {
          ...problemMap,
          [player]: getProblems(game, player),
        };
      },
      {},
    ),
  };
}
export async function assignPlayerToRole(
  gameId: string,
  player: string,
  role: Role,
): Promise<void> {
  const game = await retrieveGame(gameId);
  const gameInstance = game.readOnce();
  game.update({
    ...gameInstance,
    playersToRoles: {
      ...gameInstance.playersToRoles,
      [player]: role,
    },
  });
}
