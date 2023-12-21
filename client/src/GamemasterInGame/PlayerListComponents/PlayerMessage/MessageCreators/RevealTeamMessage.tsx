import {
  CharacterType,
  PlayerMessageCreatorMap,
} from "@hidden-identity/shared";
import { useDynamicList } from "../../Selectors/useDynamicList";
import { useDefiniteGame } from "../../../../store/GameContext";
import { useState } from "react";
import { PlayerSelectList } from "../../Selectors";
import { Restrictions } from "../messageShared/Restrictions";
import { Flex, Heading } from "@radix-ui/themes";
import { TeamSelect } from "../../Selectors/TeamSelect";
import { getCharacter } from "@hidden-identity/shared";
import { usePlayerRestrictions } from "../../Selectors/Restrictions";
import { SubmitMessage } from "../messageShared/SubmitMessage";

export interface RevealTeamMessageProps {
  message: PlayerMessageCreatorMap["reveal-team"];
  player: string;
}
export function RevealTeamMessage({ message, player }: RevealTeamMessageProps) {
  const { game } = useDefiniteGame();
  const [team, setTeam] = useState<CharacterType>("Demon");
  const playerFilter = usePlayerRestrictions({
    ...message.restriction,
    team: [team],
  });
  const playersState = useDynamicList<string>(game.playerList, {
    recommended: game.playerList
      .filter((p) => getCharacter(game.playersToRoles[p]).team === team)
      .filter(playerFilter),
    defaultCount: message.count,
  });

  return (
    <Flex direction="column" gap="2">
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
      <SubmitMessage
        player={player}
        message={playersState.value.map((p) => ({
          team,
          player: p,
          group: "reveal",
        }))}
      />
    </Flex>
  );
}
