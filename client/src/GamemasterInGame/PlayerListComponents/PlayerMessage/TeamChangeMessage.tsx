import { PlayerMessageMap } from "@hidden-identity/server";
import { Team, TeamSelect, otherTeam } from "../Selectors";
import { useState } from "react";
import { useDefiniteGame } from "../../../store/GameContext";
import { getCharacter } from "../../../assets/game_data/gameData";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { Flex, Heading } from "@radix-ui/themes";

export interface TeamChangeMessageProps {
  message: PlayerMessageMap["team-change"];
  player: string;
}

export function TeamChangeMessage({ player }: TeamChangeMessageProps) {
  const { game } = useDefiniteGame();
  const [team, setTeam] = useState<Team>(
    otherTeam(getCharacter(game.playersToRoles[player]).team),
  );

  return (
    <Flex direction="column" gap="2">
      <PlayerMessageLink
        className="mb-2"
        note={{
          reveal: {
            "You are now": [
              {
                team: team,
              },
            ],
          },
          message: "",
        }}
      />
      <Heading>Team</Heading>
      <TeamSelect
        currentTeam={team}
        onSelect={(next) => next && setTeam(next)}
      />
    </Flex>
  );
}
