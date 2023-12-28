import {
  type CharacterActionQueueItem,
  type PlayerMessageCreator,
  type PlayerMessageCreatorMap,
} from "@hidden-identity/shared";
import { type ComponentType } from "react";

import { AlignmentChangeMessage } from "./MessageCreators/AlignmentChangeMessage";
import { CharacterSelectedYouMessage } from "./MessageCreators/CharacterSelectedYouMessage";
import { MadnessMessage } from "./MessageCreators/MadnessMessage";
import { RevealCharacterMessage } from "./MessageCreators/RevealCharacterMessage";
import { RevealRoleMessage } from "./MessageCreators/RevealRoleMessage";
import { RevealTeamMessage } from "./MessageCreators/RevealTeamMessage";
import { RevivedMessage } from "./MessageCreators/RevivedMessage";
import { RoleChangeMessage } from "./MessageCreators/RoleChangeMessage";

interface PlayerMessageFlowProps {
  message: PlayerMessageCreator;
  action: CharacterActionQueueItem;
}
const ComponentMap: {
  [K in PlayerMessageCreator["type"]]: ComponentType<{
    action: CharacterActionQueueItem;
    message: PlayerMessageCreatorMap[K];
  }>;
} = {
  "reveal-role": RevealRoleMessage,
  "reveal-character": RevealCharacterMessage,
  "reveal-team": RevealTeamMessage,
  "character-selected-you": CharacterSelectedYouMessage,
  madness: MadnessMessage,
  revived: RevivedMessage,
  "role-change": RoleChangeMessage,
  "alignment-change": AlignmentChangeMessage,
};

export function PlayerMessageFlow({ message, action }: PlayerMessageFlowProps) {
  const Component = ComponentMap[message.type] as React.ComponentType<{
    action: CharacterActionQueueItem;
    message: PlayerMessageCreatorMap[typeof message.type];
  }>;
  return <Component action={action} message={message} />;
}
