import { PlayerMessage, PlayerMessageMap } from "@hidden-identity/server";
// import { exhaustiveCheck } from "../../../utils/exhaustiveCheck";
import { RevealRoleMessage } from "./RevealRoleMessage";
import { DemonMessage } from "./DemonMessage";
import { RevealPlayerMessage } from "./RevealPlayerMessage";
import { RevealTeamMessage } from "./RevealTeamMessage";
import { MadnessMessage } from "./MadnessMessage";
import { RevivedMessage } from "./RevivedMessage";
import { RoleChangeMessage } from "./RoleChangeMessage";
import { TeamChangeMessage } from "./TeamChangeMessage";
import { CharacterSelectedYouMessage } from "./CharacterSelectedYouMessage";
import { ComponentType } from "react";

interface PlayerMessageFlowProps {
  message: PlayerMessage;
  player: string;
}
const ComponentMap: {
  [K in PlayerMessage["type"]]: ComponentType<{
    player: string;
    message: PlayerMessageMap[K];
  }>;
} = {
  "demon-first-night": DemonMessage,
  "reveal-role": RevealRoleMessage,
  "reveal-player": RevealPlayerMessage,
  "reveal-team": RevealTeamMessage,
  "character-selected-you": CharacterSelectedYouMessage,
  madness: MadnessMessage,
  revived: RevivedMessage,
  "role-change": RoleChangeMessage,
  "team-change": TeamChangeMessage,
};

export function PlayerMessageFlow({ message, player }: PlayerMessageFlowProps) {
  const Component = ComponentMap[message.type] as React.ComponentType<{
    player: string;
    message: PlayerMessage;
  }>;
  return <Component player={player} message={message} />;
}
