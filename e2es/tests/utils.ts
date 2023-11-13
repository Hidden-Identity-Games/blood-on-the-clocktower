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

export async function joinGameAs(
  page: Page,
  gameId: string,
  playerName: string,
) {
  await page.goto(urlFromBase("", { testPlayerKey: playerName }));
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
) {
  await joinGameAs(page, gameId, playerName);
  await page.getByRole("button", { name: /Yes/ }).click();
}

export async function addPlayerToGame(
  context: BrowserContext,
  gameId: string,
  playerName: string,
): Promise<void>;

export async function addPlayerToGame(
  context: BrowserContext,
  gameId: string,
  playerName: string,
  keepPage: true,
): Promise<Page>;

export async function addPlayerToGame(
  context: BrowserContext,
  gameId: string,
  playerName: string,
  keepPage?: true,
): Promise<Page | void> {
  const page = await context.newPage();
  await joinGameAs(page, gameId, playerName);
  if (keepPage) {
    return page;
  } else {
    await page.close();
  }
}

async function asyncMap<Input, Output>(
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
      page: await addPlayerToGame(context, gameId, playerName, true),
    };
  });
}

export async function assignRoles(players: PlayerPage[]) {
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
