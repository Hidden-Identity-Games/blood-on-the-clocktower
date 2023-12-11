import { fakerEN } from "@faker-js/faker";
import {
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
import { GameMachine } from "../gameMachine/gameMachine.ts";
import { drawRole } from "../gameMachine/gameActions.ts";

export class GameCreator {
  game: GameMachine;
  script: Script;
  constructor(script: Script, game?: GameMachine) {
    this.game = game ?? new GameMachine();
    this.script = script;
  }

  addPlayers(playerCount: number) {
    const players = Array.from({ length: playerCount }).map(() =>
      fakerEN.person.firstName().toLocaleLowerCase(),
    );

    players.forEach((player) => {
      this.game.dispatch({ type: "AddPlayer", player, traveling: false });
    });
    return this;
  }

  addTraveler(role?: Role) {
    const player = fakerEN.person.firstName();
    this.game.dispatch({ type: "AddPlayer", player, traveling: true });
    this.game.dispatch({
      type: "ChangePlayerRole",
      player,
      role: role ?? pluck(allTravelers()),
    });
    this.game.dispatch({ type: "SeenRole", player });

    return this;
  }

  assignSeating() {
    const players = Object.keys(this.game.getGame().playersToRoles);
    players.forEach((player, index) => {
      this.game.dispatch({
        type: "SetNeighbor",
        player,
        newRightNeighbor: players[(index + 1) % players.length],
      });
    });
    return this;
  }

  distributeRolesToPlayers() {
    const game = this.game.getGame();

    const nonTravelerPlayers = game.playerList.filter(
      (player) => !game.travelers[player],
    );

    nonTravelerPlayers.forEach((player, index) => {
      this.game.dispatch(drawRole({ player, roleNumber: index + 1 }));
    });
    return this;
  }

  assignRandomRolesToCharacters() {
    this.fillRoleBag();
    this.distributeRolesToPlayers();
    this.assignAllTravelers();

    return this;
  }

  fillRoleBag(roles?: Role[]) {
    const playerCount = this.game
      .getGame()
      .playerList.filter(
        (player) => !this.game.getGame().travelers[player],
      ).length;

    let roleBagCharacters = roles;
    if (!roleBagCharacters) {
      const filledScript = this.script
        .map(({ id }) => getCharacter(id))
        .filter((c) => !c.delusional);
      const generatedRoles = shuffleList(
        toEntries(DistributionsByPlayerCount[playerCount])
          .map(([team, count]) => {
            return pick(
              count,
              filledScript.filter((char) => char.team === team),
            );
          })
          .flat(),
      ).map((c) => c.id);
      roleBagCharacters = generatedRoles;
    }

    this.game.dispatch({
      type: "FillRoleBag",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      roles: roleBagCharacters,
    });
    return this;
  }

  assignAllTravelers() {
    const game = this.game.getGame();
    // fill travelers
    const travelerPlayers = game.playerList.filter(
      // could be in travelers but false
      (player) => game.travelers[player],
    );

    const travelerCharacters = shuffleList(allTravelers());
    travelerPlayers.forEach((player, index) => {
      this.game.dispatch({
        type: "ChangePlayerRole",
        player,
        role: travelerCharacters[index],
      });
    });

    return this;
  }

  update(updater: (game: typeof this.game) => void) {
    updater(this.game);
    return this;
  }

  moveToSetup() {
    this.game.dispatch({ type: "ManuallysetStatus", status: "Setup" });
    return this;
  }

  toGameMachine() {
    return this.game;
  }
}
