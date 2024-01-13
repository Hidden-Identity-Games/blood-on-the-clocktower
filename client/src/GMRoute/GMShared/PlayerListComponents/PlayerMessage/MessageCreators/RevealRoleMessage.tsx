import {
  type CharacterActionQueueItem,
  type PlayerMessageCreatorMap,
  type Role,
} from "@hidden-identity/shared";

import { useDefiniteGame } from "../../../../../store/GameContext";
import { PlayerSelectList, RoleSelectList } from "../../Selectors";
import {
  useCharacterRestriction,
  usePlayerRestrictions,
} from "../../Selectors/Restrictions";
import { useDynamicList } from "../../Selectors/useDynamicList";
import { Restrictions } from "../messageShared/Restrictions";
import { SubmitMessage } from "../messageShared/SubmitMessage";

export interface RevealRoleMessageProps {
  message: PlayerMessageCreatorMap["reveal-role"];
  action: CharacterActionQueueItem;
}
export function RevealRoleMessage({ message, action }: RevealRoleMessageProps) {
  const { player } = action;
  const playerfilter = usePlayerRestrictions({
    ...message.restriction,
    inPlay: true,
  });
  const { game } = useDefiniteGame();
  const { script } = game;

  const rolesList = script.map(({ id }) => id);

  const roleFilter = useCharacterRestriction(message.restriction);
  const rolesState = useDynamicList<Role>(rolesList, {
    recommended: rolesList.filter(roleFilter),
    defaultCount: 1,
  });

  const playersState = useDynamicList<string>(game.playerList, {
    recommended: game.playerList
      .filter((p) => player !== p)
      .filter(playerfilter),
    mustInclude: game.playerList.filter(
      (p) => game.playersToRoles[p] === rolesState.value[0],
    ),
    defaultCount: message.count,
  });

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Create a reveal role message</h1>
      <div>
        Restrictions: <Restrictions restrictions={message.restriction} />
      </div>
      <RoleSelectList
        fixedSize
        roles={rolesState.value}
        addRole={rolesState.add}
        replaceRole={rolesState.replace}
      />

      <PlayerSelectList
        players={playersState.value}
        addPlayer={playersState.add}
        replacePlayer={playersState.replace}
      />
      <SubmitMessage
        action={action}
        player={player}
        message={playersState.value.map((p) => ({
          character: rolesState.value[0] ?? undefined,
          player: p,
          group: "Reveal",
        }))}
      />
    </div>
  );
}
