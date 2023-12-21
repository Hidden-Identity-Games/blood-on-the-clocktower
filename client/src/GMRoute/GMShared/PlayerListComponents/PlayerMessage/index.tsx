import {
  type PlayerMessageCreator,
  type PlayerMessageCreatorMap,
} from "@hidden-identity/shared";
import { type ComponentType } from "react";

import { AlignmentChangeMessage } from "./MessageCreators/AlignmentChangeMessage";
import { CharacterSelectedYouMessage } from "./MessageCreators/CharacterSelectedYouMessage";
import { DemonMessage } from "./MessageCreators/DemonMessage";
import { MadnessMessage } from "./MessageCreators/MadnessMessage";
import { RevealCharacterMessage } from "./MessageCreators/RevealCharacterMessage";
import { RevealRoleMessage } from "./MessageCreators/RevealRoleMessage";
import { RevealTeamMessage } from "./MessageCreators/RevealTeamMessage";
import { RevivedMessage } from "./MessageCreators/RevivedMessage";
import { RoleChangeMessage } from "./MessageCreators/RoleChangeMessage";

interface PlayerMessageFlowProps {
  message: PlayerMessageCreator;
  player: string;
}
const ComponentMap: {
  [K in PlayerMessageCreator["type"]]: ComponentType<{
    player: string;
    message: PlayerMessageCreatorMap[K];
  }>;
} = {
  "reveal-role": RevealRoleMessage,
  "demon-first-night": DemonMessage,
  "reveal-character": RevealCharacterMessage,
  "reveal-team": RevealTeamMessage,
  "character-selected-you": CharacterSelectedYouMessage,
  madness: MadnessMessage,
  revived: RevivedMessage,
  "role-change": RoleChangeMessage,
  "alignment-change": AlignmentChangeMessage,
};

export function PlayerMessageFlow({ message, player }: PlayerMessageFlowProps) {
  const Component = ComponentMap[message.type] as React.ComponentType<{
    player: string;
    message: PlayerMessageCreatorMap[typeof message.type];
  }>;
  return <Component player={player} message={message} />;
}
