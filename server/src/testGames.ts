import { addTestGame } from "./database/gameDB/base.ts";
import { type Role, getScript } from "@hidden-identity/shared";
import { GameCreator } from "./testingUtils/gameCreator.ts";

export async function setupTestGames(): Promise<void> {
  await addTestGame(
    "test-game",
    new GameCreator(getScript("Trouble Brewing"))
      .addPlayers(15)
      .assignSeating(),
  );

  await addTestGame(
    "tg-f-night",
    new GameCreator(getScript("Trouble Brewing"))
      .addPlayers(15)
      .assignSeating()
      .assignRandomRolesToCharacters()
      .moveToSetup()
      .update((game) => {
        const randomPlayer = Object.keys(game.getGame().playersToRoles)[0];
        game.dispatch({
          type: "AddPlayerStatus",
          status: { id: "poison", type: "poison" },
          player: randomPlayer,
        });
        game.dispatch({
          type: "AddPlayerStatus",
          status: { id: "drunk", type: "drunk" },
          player: randomPlayer,
        });
      }),
  );

  await addTestGame(
    "tg-bmr",
    new GameCreator(getScript("Bad Moon Rising"))
      .addPlayers(15)
      .assignSeating()
      .assignRandomRolesToCharacters()
      .moveToSetup()
      .update((game) => {
        const randomPlayer = Object.keys(game.getGame().playersToRoles)[0];

        game.dispatch({
          type: "AddPlayerStatus",
          status: { id: "poison", type: "poison" },
          player: randomPlayer,
        });
        game.dispatch({
          type: "AddPlayerStatus",
          status: { id: "drunk", type: "drunk" },
          player: randomPlayer,
        });
      }),
  );

  await addTestGame(
    "tg-travelers",
    new GameCreator(getScript("Bad Moon Rising"))
      .addPlayers(15)
      .assignSeating()
      .assignRandomRolesToCharacters()
      .moveToSetup()
      .addTraveler(),
  );
  await addTestGame(
    "tg-legion",
    new GameCreator(getScript("🌶️ TB"))
      .addPlayers(15)
      .assignSeating()
      .assignAllTravelers()
      .fillRoleBag([
        ...Array.from({ length: 8 }).map(() => "legion" as Role),
        "undertaker" as Role,
        "undertaker" as Role,
        "empath" as Role,
        "empath" as Role,
        "virgin" as Role,
        "recluse" as Role,
        "saint" as Role,
      ])
      .distributeRolesToPlayers()
      .addTraveler(),
  );
}
