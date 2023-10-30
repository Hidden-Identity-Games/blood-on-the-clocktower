import { fakerEN } from "@faker-js/faker";
import { createGame } from "../database/gameDB/base.ts";
import { _addPLayerToGame } from "../database/gameDB/player.ts";
import {
  type BaseUnifiedGame,
  DistributionsByPlayerCount,
  type Script,
  allTravelers,
  getCharacter,
  pick,
  shuffleList,
  toEntries,
  pluck,
  type Role,
} from "@hidden-identity/shared";

export class GameCreator {
  game: BaseUnifiedGame;
  constructor(game?: BaseUnifiedGame) {
    this.game = game ?? createGame();
    this.game.gmSecretHash = "t";
  }

  addPlayers(playerCount: number) {
    return this.update((game) => {
      const players = Array.from({ length: playerCount }).map(() =>
        fakerEN.person.firstName(),
      );

      return players.reduce(
        (currentGame, player) => _addPLayerToGame(currentGame, player, false),
        game,
      );
    });
  }

  addTraveler(role?: Role) {
    return this.update((game) => {
      const player = fakerEN.person.firstName();

      return {
        ..._addPLayerToGame(game, player, true),
        playersToRoles: {
          ...game.playersToRoles,
          [player]: role ?? pluck(allTravelers()),
        },
        playersSeenRoles: [...game.playersSeenRoles, player],
      };
    });
  }

  assignSeating() {
    return this.update((game) => {
      const players = Object.keys(game.playersToRoles);
      return players.reduce(
        (currentGame, player, index) => ({
          ...currentGame,
          partialPlayerOrdering: {
            ...currentGame.partialPlayerOrdering,
            [player]: { rightNeighbor: players[(index + 1) % players.length] },
          },
        }),
        game,
      );
    });
  }

  assignRandomRolesToCharacters(script: Script) {
    return this.update((game) => {
      const filledScript = script
        .map(({ id }) => getCharacter(id))
        .filter((c) => !c.delusional);
      const nonTravelers = Object.keys(game.playersToRoles).filter(
        (player) => !game.travelers[player],
      );
      const travelers = Object.keys(game.playersToRoles).filter(
        // could be in travelers but false
        (player) => game.travelers[player],
      );

      const travelerCharacters = shuffleList(allTravelers());

      const characters = shuffleList(
        toEntries(DistributionsByPlayerCount[nonTravelers.length])
          .map(([team, count]) => {
            return pick(
              count,
              filledScript.filter((char) => char.team === team),
            );
          })
          .flat(),
      );

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
    });
  }

  moveToSetup() {
    return this.update((game) => ({
      ...game,
      gameStatus: "Setup",
    }));
  }

  update(updater: (game: BaseUnifiedGame) => BaseUnifiedGame) {
    return new GameCreator(updater(this.game));
  }

  toGame() {
    return this.game;
  }
}
