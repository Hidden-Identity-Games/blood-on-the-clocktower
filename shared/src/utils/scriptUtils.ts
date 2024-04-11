import { DistributionsByPlayerCount, getCharacter } from "../gameData/index.ts";
import { type Character, type Script } from "../shapes/index.ts";
import { toKeys } from "./objectUtils.ts";
import { pick } from "./shuffleList.ts";

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
