import {
  PlayerMessageCreator,
  PlayerMessageCreatorMap,
} from "@hidden-identity/shared";
import { RevealRoleMessage } from "./MessageCreators/RevealRoleMessage";
import { DemonMessage } from "./MessageCreators/DemonMessage";
import { RevealCharacterMessage } from "./MessageCreators/RevealCharacterMessage";
import { RevealTeamMessage } from "./MessageCreators/RevealTeamMessage";
import { MadnessMessage } from "./MessageCreators/MadnessMessage";
import { RevivedMessage } from "./MessageCreators/RevivedMessage";
import { RoleChangeMessage } from "./MessageCreators/RoleChangeMessage";
import { AlignmentChangeMessage } from "./MessageCreators/AlignmentChangeMessage";
import { CharacterSelectedYouMessage } from "./MessageCreators/CharacterSelectedYouMessage";
import { ComponentType } from "react";

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
