import { getScript, type Role } from "@hidden-identity/shared";

import { addTestGame } from "./database/gameDB/base.ts";
import { GameCreator } from "./testingUtils/gameCreator.ts";

export function setupTestGames() {
  addTestGame(
    "test-game",
    new GameCreator(getScript("Trouble Brewing"))
      .addPlayers(15)
      .assignSeating(),
  );

  addTestGame(
    "tg-f-night",
    new GameCreator(getScript("Trouble Brewing"))
      .addPlayers(15)
      .assignSeating()
      .assignRandomRolesToCharacters()
      .moveToSetup(),
  );

  addTestGame(
    "tg-bmr",
    new GameCreator(getScript("Bad Moon Rising"))
      .addPlayers(15)
      .assignSeating()
      .assignRandomRolesToCharacters()
      .moveToSetup(),
  );

  addTestGame(
    "tg-travelers",
    new GameCreator(getScript("Bad Moon Rising"))
      .addPlayers(15)
      .assignSeating()
      .assignRandomRolesToCharacters()
      .moveToSetup()
      .addTraveler(),
  );
  addTestGame(
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
