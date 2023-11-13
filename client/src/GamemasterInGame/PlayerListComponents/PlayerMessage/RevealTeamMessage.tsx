import { CharacterType, PlayerMessageMap } from "@hidden-identity/shared";
import { useDynamicList } from "../Selectors/useDynamicList";
import { useDefiniteGame } from "../../../store/GameContext";
import { useState } from "react";
import { PlayerSelectList } from "../Selectors";
import { Restrictions } from "./Restrictions";
import { Flex, Heading } from "@radix-ui/themes";
import { PlayerMessageLink } from "./PlayerMessageLink";
import { TeamSelect } from "../Selectors/TeamSelect";
import { getCharacter } from "@hidden-identity/shared";
import { usePlayerRestrictions } from "../Selectors/Restrictions";
import { Reveal } from "../../../types/PlayerMessageScreen";

export interface RevealTeamMessageProps {
  message: PlayerMessageMap["reveal-team"];
  player: string;
  onOpenNote: (message: string, reveal: Record<string, Reveal[]>) => void;
}
export function RevealTeamMessage({
  message,
  onOpenNote,
}: RevealTeamMessageProps) {
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

  const text = "";
  const reveal = {
    Reveal: playersState.value.map((p) => ({
      team,
      player: p,
    })),
  };

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
      <PlayerMessageLink
        className="mt-2"
        note={{
          reveal: reveal,
          message: text,
        }}
        onOpenNote={onOpenNote}
      />
    </Flex>
  );
}
