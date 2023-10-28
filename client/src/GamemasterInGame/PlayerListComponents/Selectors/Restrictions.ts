import { Restriction, Role } from "@hidden-identity/server";
import { useGetPlayerAlignment } from "../../../store/useStore";
import { useDefiniteGame } from "../../../store/GameContext";
import { getCharacter } from "@hidden-identity/shared";

function usePlayerOnlyRestriction(
  restriction?: Restriction,
): (player: string) => boolean {
  const { game } = useDefiniteGame();
  const getAlignment = useGetPlayerAlignment();
  if (!restriction) {
    return () => true;
  }
  return (player) => {
    if (restriction.alignment) {
      if (getAlignment(player) !== restriction.alignment) {
        return false;
      }
    }

    if (restriction.alive) {
      if (game.deadPlayers[player]) {
        return false;
      }
    }

    if (restriction.role) {
      if (
        restriction.role.includes(getCharacter(game.playersToRoles[player]).id)
      ) {
        return false;
      }
    }

    if (restriction.team) {
      if (
        !restriction.team.includes(
          getCharacter(game.playersToRoles[player]).team,
        )
      ) {
        return false;
      }
    }

    return true;
  };
}

export function useCharacterRestriction(
  restriction?: Restriction,
): (role: Role) => boolean {
  const { game } = useDefiniteGame();

  if (!restriction) {
    return () => true;
  }
  return (role: Role) => {
    if (restriction.inPlay) {
      if (!Object.values(game.playersToRoles).includes(role)) {
        return false;
      }
    }

    if (restriction.role) {
      if (!restriction.role.includes(role)) {
        return false;
      }
    }

    if (restriction.team) {
      if (!restriction.team.includes(getCharacter(role).team)) {
        return false;
      }
    }

    if (restriction.inPlay === true) {
      if (!Object.values(game.playersToRoles).includes(role)) {
        return false;
      }
    }

    if (restriction.inPlay === false) {
      if (Object.values(game.playersToRoles).includes(role)) {
        return false;
      }
    }

    return true;
  };
}

export function usePlayerRestrictions(restriction?: Restriction) {
  const { game } = useDefiniteGame();
  const playerFilter = usePlayerOnlyRestriction(restriction);
  const characterFilter = useCharacterRestriction(restriction);

  return (player: string) =>
    playerFilter(player) && characterFilter(game.playersToRoles[player]);
}
