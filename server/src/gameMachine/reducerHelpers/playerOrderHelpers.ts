import {
  type Neighbors,
  toEntries,
  type UnifiedGame,
} from "@hidden-identity/shared";

export function extractPlayerFromCircle(
  state: UnifiedGame["partialPlayerOrdering"],
  player: string,
) {
  const { [player]: kickedPlayerNeighbor, ...nextState } = state;
  const leftNeighbor = findLeftNeighbor(state, player);
  if (leftNeighbor) {
    return {
      ...nextState,
      [leftNeighbor[0]]: {
        rightNeighbor: kickedPlayerNeighbor?.rightNeighbor ?? null,
      },
    };
  } else {
    return nextState;
  }
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
