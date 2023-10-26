import {
  PlayerMessage,
  PlayerMessageMap,
  Reveal,
} from "@hidden-identity/server";
// import { exhaustiveCheck } from "../../../utils/exhaustiveCheck";
import { RevealRoleMessage } from "./RevealRoleMessage";
import { DemonMessage } from "./DemonMessage";
import { RevealPlayerMessage } from "./RevealPlayerMessage";
import { RevealTeamMessage } from "./RevealTeamMessage";
import { MadnessMessage } from "./MadnessMessage";
import { RevivedMessage } from "./RevivedMessage";
import { RoleChangeMessage } from "./RoleChangeMessage";
import { AlignmentChangeMessage } from "./AlignmentChangeMessage";
import { CharacterSelectedYouMessage } from "./CharacterSelectedYouMessage";
import { ComponentType } from "react";

interface PlayerMessageFlowProps {
  message: PlayerMessage;
  player: string;
  onOpenNote: (
    message: string,
    reveal: Record<string, Reveal[]>,
  ) => void;
}
const ComponentMap: {
  [K in PlayerMessage["type"]]: ComponentType<{
    player: string;
    message: PlayerMessageMap[K];
    onOpenNote: (
      message: string,
      reveal: Record<string, Reveal[]>,
    ) => void;
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
  "alignment-change": AlignmentChangeMessage,
};

export function PlayerMessageFlow({
  message,
  player,
  onOpenNote,
}: PlayerMessageFlowProps) {
  const Component = ComponentMap[message.type] as React.ComponentType<{
    player: string;
    message: PlayerMessageMap[typeof message.type];
    onOpenNote: (
      message: string,
      reveal: Record<string, Reveal[]>,
    ) => void;
  }>;
  return (
    <Component
      player={player}
      message={message}
      onOpenNote={onOpenNote}
    />
  );
}
