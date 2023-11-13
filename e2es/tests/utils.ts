import { ScriptName, getCharacter, getScript } from "@hidden-identity/shared";
import { urlFromBase } from "./productUrls";
import { BrowserContext, Page } from "@playwright/test";

export async function createNewGame(page: Page, script: string) {
  await page.goto(urlFromBase("", {}));
  await page.getByRole("button", { name: "Create" }).click();
  await page
    .getByRole("button", {
      name: script,
    })
    .click();
  await page.getByRole("button", { name: "Create" }).click();

  await page.waitForURL(/\/gm/);

  const url = new URL(page.url());
  return url.searchParams.get("gameId")!;
}

export async function createStartableGame(
  context: BrowserContext,
  script: ScriptName,
  players: string[],
) {
  const gmPage = await context.newPage();
  const gameId = await createNewGame(gmPage, script);

  await gmPage.getByRole("button", { name: "desktop" }).click();
  await gmPage.getByRole("checkbox", { name: "Washerwoman" }).waitFor();
  const TBRoles = getAssignableCharactersNamesFromScript(script).slice(
    0,
    players.length,
  );

  await assignRoles(gmPage, { roles: TBRoles });

  const playerPages = await populateGameWithPlayers(context, players, gameId);
  await assignSeats(playerPages);
  return { playerPages, gameId, gmPage };
}

export async function joinGameAs(
  page: Page,
  gameId: string,
  playerName: string,
  testKey: string = playerName,
) {
  await page.goto(urlFromBase("", { testPlayerKey: testKey }));
  await page.getByRole("button", { name: "Join game" }).click();
  await page.getByRole("textbox", { name: "code" }).fill(gameId);
  await page.getByRole("button", { name: "Join" }).click();
  await page.getByRole("textbox", { name: "name" }).fill(playerName);
  await page.getByRole("button", { name: "Join" }).click();
}

export async function rejoinGameAs(
  page: Page,
  gameId: string,
  playerName: string,
  testKey: string = playerName,
) {
  await joinGameAs(page, gameId, playerName, testKey);
  await page.getByRole("button", { name: /Yes/ }).click();
}

export async function addPlayerToGame(
  context: BrowserContext,
  gameId: string,
  playerName: string,
): Promise<Page> {
  const page = await context.newPage();
  await joinGameAs(page, gameId, playerName);
  return page;
}

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

export interface PlayerPage {
  name: string;
  page: Page;
}

export async function populateGameWithPlayers(
  context: BrowserContext,
  players: string[],
  gameId: string,
): Promise<PlayerPage[]> {
  return await asyncMap(players, async (playerName) => {
    return {
      name: playerName,
      page: await addPlayerToGame(context, gameId, playerName),
    };
  });
}

export async function assignSeats(players: PlayerPage[]) {
  await asyncMap(players, async ({ page }, playerNumber) => {
    const nextPlayerNumber = (playerNumber + 1) % players.length;

    await page
      .getByRole("button", {
        name: players[nextPlayerNumber].name,
        exact: true,
      })
      .click();
  });
}

export function getAssignableCharactersNamesFromScript(script: ScriptName) {
  return getScript(script)
    .map((role) => getCharacter(role.id))
    .filter((character) => !character.delusional)
    .map((character) => character.name);
}
export async function assignRoles(page: Page, { roles }: { roles: string[] }) {
  for (const role of roles) {
    await page
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .getByRole("checkbox", { name: role })
      .click();
  }
}
export async function acknowledgeRoles(pages: PlayerPage[]) {
  await asyncMap(pages, async ({ page }, playerNumber) => {
    await page
      .getByRole("button", { name: `Role number ${playerNumber + 1}` })
      .click();

    await page.getByRole("button", { name: /reveal role/i }).click();
    await page.getByRole("button", { name: /i know my role/i }).click();
    return null;
  });
}
