import { getScript, type Role } from "@hidden-identity/shared";
import { expect, test } from "@playwright/test";
import { generate } from "random-words";

import { trpc } from "./api/client";
import { urlFromBase } from "./productUrls";

test("displays Fabled/Loric section on GM menu tab", async ({ page }) => {
  const baseScript = getScript("Trouble Brewing");
  const scriptWithFabled = [
    ...baseScript,
    { id: "djinn" as Role },
    { id: "tor" as Role },
  ];

  // Create a fully started game with fabled in the script
  const gameId = generate(3).join("-").toUpperCase();
  const game = await trpc.createGame.mutate({
    gameId,
    script: scriptWithFabled,
    testGameOptions: {
      isTestGame: true,
      players: 10,
      randomRoles: true,
    },
  });

  await page.goto(
    urlFromBase("gm", { gameId, gmSecretHash: game.gmSecretHash }),
  );

  await page.getByRole("tab", { name: /menu/i }).click();

  await expect(page.getByText("Fabled/Loric")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Djinn", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Tor", exact: true }),
  ).toBeVisible();
});
