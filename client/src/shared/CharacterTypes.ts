export const colorMap = {
  Townsfolk: "blue",
  Outsider: "cyan",
  Minion: "tomato",
  Demon: "crimson",
  // TODO
  Traveler: undefined,
  Unknown: undefined,
} as const;

export const teamColorMap = {
  ...colorMap,
  Good: "blue",
  Evil: "crimson",
  Unknown: "amber",
} as const;
