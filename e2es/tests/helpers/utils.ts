import {
  Character,
  DistributionsByPlayerCount,
  Script,
  getCharacter,
  pick,
  toKeys,
} from "@hidden-identity/shared";

export async function asyncMap<Input, Output>(
  inputList: Input[],
  mapper: (input: Input, index: number) => Promise<Output>,
) {
  const outputList: Output[] = [];
  for (let i = 0; i < inputList.length; i++) {
    outputList.push(await mapper(inputList[i], i));
  }
  return outputList;
}

export function getRandomCharactersForDistribution(
  script: Script,
  playerCount: keyof typeof DistributionsByPlayerCount,
) {
  const characters = script
    .map((role) => getCharacter(role.id))
    .filter((character) => !character.delusional);
  const characterByTeam = characters.reduce<
    Record<Character["team"], Character[]>
  >(
    (acc, curr) => ({
      ...acc,
      [curr.team]: [...(acc[curr.team] ?? []), curr],
    }),
    {} as Record<Character["team"], Character[]>,
  );
  const counts = DistributionsByPlayerCount[playerCount];
  return toKeys(characterByTeam).flatMap((team) =>
    pick(counts[team], characterByTeam[team]),
  );
}
