import {
  type Neighbors,
  toEntries,
  type UnifiedGame,
} from "@hidden-identity/shared";

export function extractPlayerFromCircle(
  state: UnifiedGame["partialPlayerOrdering"],
  player: string,
) {
  const { [player]: kickedPlayerNeighbor } = state;
  const leftNeighbor = findLeftNeighbor(state, player);
  return {
    ...state,
    ...(leftNeighbor && {
      [leftNeighbor[0]]: {
        rightNeighbor: kickedPlayerNeighbor?.rightNeighbor ?? null,
      },
    }),
    [player]: {
      rightNeighbor: null,
    },
  };
}

export function insertIntoCircle(
  state: UnifiedGame["partialPlayerOrdering"],
  player: string,
  newRightNeighbor: string,
) {
  const newLeftNeighborEntry = findLeftNeighbor(state, newRightNeighbor);

  return {
    ...state,
    ...(newLeftNeighborEntry && {
      [newLeftNeighborEntry[0]]: {
        rightNeighbor: player,
      },
    }),
    [player]: { rightNeighbor: newRightNeighbor },
  };
}

function findLeftNeighbor(
  state: UnifiedGame["partialPlayerOrdering"],
  player: string,
): undefined | [string, Neighbors | null] {
  return toEntries(state).find(
    ([_, neighbors]) => neighbors?.rightNeighbor === player,
  );
}
