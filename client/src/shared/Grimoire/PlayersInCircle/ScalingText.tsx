function is(num: number) {
  return {
    inBounds: (lower: number, upper: number = Number.POSITIVE_INFINITY) => {
      return String(num > lower && num <= upper);
    },
  };
}

export function useScalingTextClassName(width: number) {
  return {
    [is(width).inBounds(150)]: "text-3xl",
    [is(width).inBounds(125, 150)]: "text-2xl",
    [is(width).inBounds(100, 125)]: "text-xl",
    [is(width).inBounds(75, 100)]: "text-base",
    [is(width).inBounds(50, 75)]: "text-sm",
    [is(width).inBounds(0, 50)]: "text-xs",
  }["true"];
}
