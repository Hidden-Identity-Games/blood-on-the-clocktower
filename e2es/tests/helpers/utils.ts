import { Script, getCharacter } from "@hidden-identity/shared";

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

export function getRandomCharactersForDistribution(script: Script) {
  return script
    .map((role) => getCharacter(role.id))
    .filter((character) => !character.delusional);
}
