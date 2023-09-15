export function exhaustiveCheck(typeToCheck: never) {
  throw new Error(`Missed exhaustive check for ${typeToCheck}`);
}
