import { addTestGame } from "./database/gameDB/base.ts";
import {
  type Role,
  getCharacter,
  getScript,
  shuffleList,
  allTravelers,
} from "@hidden-identity/shared";
import { GameCreator } from "./testingUtils/gameCreator.ts";

export async function setupTestGames(): Promise<void> {
  await addTestGame(
    "test-game",
    new GameCreator().addPlayers(15).assignSeating().toGame(),
    getScript("Trouble Brewing"),
  );

  await addTestGame(
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

  await addTestGame(
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

  await addTestGame(
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
  await addTestGame(
    "tg-legion",
    new GameCreator()
      .addPlayers(15)
      .assignSeating()
      .update((game) => {
        const nonTravelers = Object.keys(game.playersToRoles).filter(
          (player) => !game.travelers[player],
        );
        const travelers = Object.keys(game.playersToRoles).filter(
          // could be in travelers but false
          (player) => game.travelers[player],
        );

        const travelerCharacters = shuffleList(allTravelers());

        const characters = [
          ...Array.from({ length: 8 }).map(() =>
            getCharacter("legion" as Role),
          ),
          getCharacter("undertaker" as Role),
          getCharacter("undertaker" as Role),
          getCharacter("empath" as Role),
          getCharacter("empath" as Role),
          getCharacter("virgin" as Role),
          getCharacter("recluse" as Role),
          getCharacter("saint" as Role),
        ];

        const nonTravelersAndRoles = Object.fromEntries(
          shuffleList(nonTravelers).map((player, idx) => [
            player,
            characters[idx].id,
          ]),
        );

        const travelersAndRoles = Object.fromEntries(
          shuffleList(travelers).map((player, idx) => [
            player,
            travelerCharacters[idx],
          ]),
        );
        game.playersToRoles = {
          ...nonTravelersAndRoles,
          ...travelersAndRoles,
        };

        game.playersSeenRoles = [...nonTravelers, ...travelers];
        game.gameStatus = "Setup";

        return game;
      })
      .moveToSetup()
      .addTraveler()
      .toGame(),
    getScript("🌶️ TB"),
  );
}
