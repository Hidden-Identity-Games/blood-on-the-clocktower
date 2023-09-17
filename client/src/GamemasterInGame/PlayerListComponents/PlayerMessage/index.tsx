import { PlayerMessage, PlayerMessageMap } from "@hidden-identity/server";
// import { exhaustiveCheck } from "../../../utils/exhaustiveCheck";
import { RevealRoleMessage } from "./RevealRoleMessage";
import { DemonMessage } from "./DemonMessage";
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
  "reveal-player": () => null,
  "reveal-team": () => null,
  "character-selected-you": () => null,
  madness: () => null,
  revived: () => null,
  "role-change": () => null,
  "team-change": () => null,
};

export function PlayerMessageFlow({ message, player }: PlayerMessageFlowProps) {
  const Component = ComponentMap[message.type] as React.ComponentType<{
    player: string;
    message: PlayerMessage;
  }>;
  return <Component player={player} message={message} />;
}
