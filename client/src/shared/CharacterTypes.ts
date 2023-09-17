export const colorMap = {
  Townsfolk: "blue",
  Outsider: "cyan",
  Minion: "tomato",
  Demon: "crimson",
  Unknown: undefined,
} as const;

export const teamColorMap = {
  ...colorMap,
  Good: "blue",
  Evil: "crimson",
} as const;
