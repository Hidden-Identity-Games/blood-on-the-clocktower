import {
  getCharacter,
  getScript,
  pick,
  type Role,
  SCRIPTS,
} from "@hidden-identity/shared";
import { describe, expect, it } from "vitest";

import {
  apiCaller,
  createGame,
  createGameWithPlayers,
  generateRandomRoleSet,
  setEstimatedPlayerCount,
  setRoleInRoleBag,
} from "./utils.ts";

describe("game setup", () => {
  describe("Estimated player count", () => {
    it("persists estimated player count", async () => {
      const gameId = await createGame();
      await setEstimatedPlayerCount(gameId, 9);
      const game = await apiCaller.getGame({ gameId });
      expect(game.estimatedPlayerCount).toEqual(9);
    });
  });
  describe("Role list", () => {
    it("adds roles to role bag", async () => {
      const script = getScript(SCRIPTS[0].name);
      const roles = pick(4, script);
      const gameId = await createGame(script);
      for (const role of roles) {
        await setRoleInRoleBag(gameId, role.id, 1);
      }
      const game = await apiCaller.getGame({ gameId });
      for (const role of roles) {
        expect(game.setupRoleSet).toMatchObject({
          [role.id]: 1,
        });
      }
    });
    it("adds roles to role bag even if out of script", async () => {
      const scriptForGame = getScript("Trouble Brewing");
      const offScriptCharacter = getCharacter("boomdandy" as Role);
      const gameId = await createGame(scriptForGame);
      await setRoleInRoleBag(gameId, offScriptCharacter.id, 1);
      const game = await apiCaller.getGame({ gameId });
      expect(game.setupRoleSet).toMatchObject({
        [offScriptCharacter.id]: 1,
      });
    });
  });

  describe("distributing roles", () => {
    it("fills role bag from setupRoles", async () => {
      const script = getScript(SCRIPTS[0].name);
      const { gameId } = await createGameWithPlayers({
        playerCount: 10,
        script,
      });
      await setRoleInRoleBag(gameId, script[0].id, 9);
      await setRoleInRoleBag(gameId, script[1].id, 1);
      await apiCaller.assignRoles({ gameId });
      const game = await apiCaller.getGame({ gameId });
      // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
      expect(Object.values(game.roleBag).sort()).toEqual(
        [...Array.from({ length: 9 }, () => script[0].id), script[1].id].sort(),
      );
    });
  });
  describe("Generating a random script", () => {
    it("can for Trouble Brewing", async () => {
      const script = getScript("Trouble Brewing");
      const gameId = await createGame(script);
      await setEstimatedPlayerCount(gameId, Math.ceil(Math.random() * 7 + 6));
      await generateRandomRoleSet(gameId);
    });
  });
});
