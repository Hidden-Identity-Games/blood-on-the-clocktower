export function shuffleList<T>(list: readonly T[]): T[] {
  return list
    .map((item) => [item, Math.random()] as const)
    .sort(([, order1], [, order2]) => order1 - order2)
    .map(([item]) => item);
}

export function pick<T>(count: number, list: readonly T[]): T[] {
  return shuffleList(list).slice(0, count);
}

export function pluck<T>(list: readonly T[]): T {
  return pick(1, list)[0];
}
