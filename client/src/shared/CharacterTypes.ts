import { type Alignment, type CharacterType } from "@hidden-identity/shared";

import { type RadixColor } from "../types/radixTypes";

export const colorMap: Record<CharacterType, RadixColor> = {
  Townsfolk: "blue",
  Outsider: "blue",
  Minion: "red",
  Demon: "red",
  Traveler: "amber",
};
export const shadCnColorMap: Record<CharacterType, string> = {
  Townsfolk: "221.2 83.2% 53.3%",
  Outsider: "221.2 83.2% 53.3%", // TODO: differentiate outsiders
  Minion: "0 72.2% 50.6%",
  Demon: "346.8 77.2% 49.8%",
  Traveler: "47.9 95.8% 53.1%",
};

export const alignmentColorMap: Record<Alignment, string> = {
  Good: "221.2 83.2% 53.3%",
  Evil: "0 72.2% 50.6%",
};
export const radixAlignmentColorMap: Record<Alignment, RadixColor> = {
  Good: "blue",
  Evil: "red",
};
