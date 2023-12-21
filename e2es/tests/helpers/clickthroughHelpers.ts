// Functions in this file will perform a task manually, and so will add tesr coverage, but are very slow.
import {
  getScript,
  type Script,
  type ScriptName,
} from "@hidden-identity/shared";
import { type BrowserContext, type Page } from "@playwright/test";

import { urlFromBase } from "../productUrls";
import { asyncMap, getRandomCharactersForDistribution } from "./utils";

export const ClickthroughModel = {
  createNewGame: async function createNewGame(page: Page, script: ScriptName) {
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
  },

  createStartableGame: async function createStartableGame(
    context: BrowserContext,
    script: ScriptName,
    players: string[],
  ) {
    const gmPage = await context.newPage();
    const gameId = await ClickthroughModel.createNewGame(gmPage, script);

    await gmPage.getByRole("checkbox", { name: "Washerwoman" }).waitFor();

    const playerPages = await ClickthroughModel.populateGameWithPlayers(
      context,
      players,
      gameId,
    );
    await ClickthroughModel.assignSeats(playerPages);

    await ClickthroughModel.fillRoleBag(gmPage, {
      script: getScript(script),
      playerCount: playerPages.length,
    });
    return { playerPages, gameId, gmPage };
  },

  joinGameAs: async function joinGameAs(
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
  },

  rejoinGameAs: async function rejoinGameAs(
    page: Page,
    gameId: string,
    playerName: string,
    testKey: string = playerName,
  ) {
    await ClickthroughModel.joinGameAs(page, gameId, playerName, testKey);
    await page.getByRole("button", { name: /Yes/ }).click();
  },

  addPlayerToGame: async function addPlayerToGame(
    context: BrowserContext,
    gameId: string,
    playerName: string,
  ): Promise<Page> {
    const page = await context.newPage();
    await ClickthroughModel.joinGameAs(page, gameId, playerName);
    return page;
  },

  populateGameWithPlayers: async function (
    context: BrowserContext,
    players: string[],
    gameId: string,
  ): Promise<PlayerPage[]> {
    return await asyncMap(players, async (playerName) => {
      return {
        name: playerName,
        page: await ClickthroughModel.addPlayerToGame(
          context,
          gameId,
          playerName,
        ),
      };
    });
  },

  assignSeats: async function (players: PlayerPage[]) {
    await asyncMap(players, async ({ page }, playerNumber) => {
      const nextPlayerNumber = (playerNumber + 1) % players.length;

      await page
        .getByRole("button", {
          name: players[nextPlayerNumber].name,
          exact: true,
        })
        .click();
    });
  },

  fillRoleBag: async function (
    page: Page,
    { script, playerCount }: { script: Script; playerCount: number },
  ) {
    const roles = getRandomCharactersForDistribution(script, playerCount);
    for (const role of roles) {
      await page.getByRole("checkbox", { name: role.name }).click();
    }
  },
  getAndAcknowledgeRoles: async function acknowledgeRoles(pages: PlayerPage[]) {
    await asyncMap(pages, async ({ page }, playerNumber) => {
      await page.setViewportSize({ height: 1000, width: 500 });
      await page
        .getByRole("button", {
          name: `Role number ${playerNumber + 1}`,
          exact: true,
        })
        .click();

      await page.getByRole("button", { name: /reveal role/i }).click();
      await page.getByRole("button", { name: /i know my role/i }).click();
      return null;
    });
  },
};

export interface PlayerPage {
  name: string;
  page: Page;
}
