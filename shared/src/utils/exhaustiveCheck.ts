export function exhaustiveCheck(typeToCheck: never) {
  throw new Error(
    `Missed exhaustive check for ${
      typeof typeToCheck === "object"
        ? JSON.stringify(typeToCheck)
        : String(typeToCheck)
    }`,
  );
}
