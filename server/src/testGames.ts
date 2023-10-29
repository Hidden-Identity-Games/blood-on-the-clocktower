import { addTestGame } from "./database/gameDB/base.ts";
import { setScript } from "./database/scriptDB.ts";
import {
  type Script,
  type BaseUnifiedGame,
  getScript,
} from "@hidden-identity/shared";
import { GameCreator } from "./testingUtils/gameCreator.ts";

export async function setupTestGames(): Promise<void> {
  await addGame(
    "test-game",
    new GameCreator().addPlayers(15).assignSeating().toGame(),
    getScript("Trouble Brewing"),
  );

  await addGame(
    "tg-f-night",
    new GameCreator()
      .addPlayers(15)
      .assignSeating()
      .assignRandomRolesToCharacters(getScript("Trouble Brewing"))
      .moveToSetup()
      .update((game) => {
        const randomPlayer = Object.keys(game.playersToRoles)[0];
        return {
          ...game,
          playerPlayerStatuses: {
            ...game.playerPlayerStatuses,
            [randomPlayer]: [
              { type: "poison", id: "poison" },
              { type: "drunk", id: "drunk" },
            ],
          },
        };
      })
      .toGame(),
    getScript("Trouble Brewing"),
  );

  await addGame(
    "tg-bmr",
    new GameCreator()
      .addPlayers(15)
      .assignSeating()
      .assignRandomRolesToCharacters(getScript("Bad Moon Rising"))
      .moveToSetup()
      .update((game) => {
        const randomPlayer = Object.keys(game.playersToRoles)[0];
        return {
          ...game,
          playerPlayerStatuses: {
            ...game.playerPlayerStatuses,
            [randomPlayer]: [
              { type: "poison", id: "poison" },
              { type: "drunk", id: "drunk" },
            ],
          },
        };
      })
      .toGame(),
    getScript("Bad Moon Rising"),
  );

  await addGame(
    "tg-travelers",
    new GameCreator()
      .addPlayers(15)
      .assignSeating()
      .assignRandomRolesToCharacters(getScript("Bad Moon Rising"))
      .moveToSetup()
      .addTraveler()
      .toGame(),
    getScript("Bad Moon Rising"),
  );
}

async function addGame(
  name: string,
  game: BaseUnifiedGame,
  script: Script,
): Promise<void> {
  await addTestGame(name, game);
  if (game.gameStatus !== "PlayersJoining") {
    await setScript(name, script);
  }
}
