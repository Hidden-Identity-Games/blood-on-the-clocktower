import {
  type CharacterActionQueueItem,
  type PlayerMessageCreatorMap,
  type Role,
} from "@hidden-identity/shared";
import { Flex, Heading } from "@radix-ui/themes";
import { useMemo } from "react";

import { useDefiniteGame } from "../../../../../store/GameContext";
import { PlayerSelectList, RoleSelectList } from "../../Selectors";
import {
  useCharacterRestriction,
  usePlayerRestrictions,
} from "../../Selectors/Restrictions";
import { useDynamicList } from "../../Selectors/useDynamicList";
import { Restrictions } from "../messageShared/Restrictions";
import { SubmitMessage } from "../messageShared/SubmitMessage";

interface RevealCharacterMessageProps {
  message: PlayerMessageCreatorMap["reveal-character"];
  action: CharacterActionQueueItem;
}

export function RevealCharacterMessage({
  message,
  action,
}: RevealCharacterMessageProps) {
  const { player } = action;
  const { restriction } = message;

  const filter = useCharacterRestriction(restriction);
  const { game } = useDefiniteGame();
  const { script } = game;

  const playerFilter = usePlayerRestrictions({
    ...message.restriction,
  });

  const playersState = useDynamicList<string>(game.playerList, {
    recommended: game.playerList
      .filter((p) => p !== player)
      .filter(playerFilter),
    defaultCount: 1,
  });

  const rolesList = useMemo(() => script.map(({ id }) => id), [script]);
  const roleState = useDynamicList<Role>(rolesList, {
    recommended: rolesList.filter(filter),
    // FIX
    mustInclude: [game.playersToRoles[playersState.value[0]]],
    defaultCount: message.count,
  });

  return (
    <Flex direction="column" gap="2">
      <Heading>Player</Heading>
      <Restrictions restrictions={message.restriction} />
      <PlayerSelectList
        players={playersState.value}
        addPlayer={playersState.add}
        replacePlayer={playersState.replace}
      />

      <RoleSelectList
        roles={roleState.value}
        addRole={roleState.add}
        replaceRole={roleState.replace}
      />
      <SubmitMessage
        action={action}
        player={player}
        message={roleState.value.map((potentialRole) => ({
          character: potentialRole,
          player: playersState.value[0],
          group: "Reveal",
        }))}
      />
    </Flex>
  );
}
