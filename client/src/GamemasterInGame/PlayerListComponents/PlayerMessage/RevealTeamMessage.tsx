import { PlayerMessageMap } from "@hidden-identity/server";
import { useDynamicList } from "../Selectors/useDynamicList";
import { useDefiniteGame } from "../../../store/GameContext";
import { useState } from "react";
import { pluck } from "../../../utils/shuffleList";
import {
  PlayerSelectList,
  Team,
  TeamSelect,
  onSameTeam,
  teams,
} from "../Selectors";
import { Restrictions } from "./Restrictions";
import { Flex, Heading } from "@radix-ui/themes";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { getCharacter } from "../../../assets/game_data/gameData";

export interface RevealTeamMessageProps {
  message: PlayerMessageMap["reveal-team"];
  player: string;
}
export function RevealTeamMessage({ message, player }: RevealTeamMessageProps) {
  const { game } = useDefiniteGame();
  const [team, setTeam] = useState<Team>(() => pluck(teams));
  const playersState = useDynamicList<string>(game.playerList, {
    recommended: game.playerList.filter(
      (p) =>
        onSameTeam(getCharacter(game.playersToRoles[p]).team, team) &&
        p !== player,
    ),
    defaultCount: message.count,
  });

  return (
    <Flex direction="column" gap="2">
      <PlayerMessageLink
        className="mb-2"
        note={{
          reveal: {
            Reveal: playersState.value.map((p) => ({
              team,
              player: p,
            })),
          },
          message: "",
        }}
      />
      <Heading>Team</Heading>
      <Restrictions restrictions={message.restriction} />
      <TeamSelect
        currentTeam={team}
        onSelect={(next) => next && setTeam(next)}
      />

      <PlayerSelectList
        players={playersState.value}
        addPlayer={playersState.add}
        replacePlayer={playersState.replace}
      />
    </Flex>
  );
}