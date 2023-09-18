import { Alignment, CharacterType } from "@hidden-identity/server";
import { RadixColor } from "../types/radixTypes";

export const colorMap: Record<CharacterType, RadixColor> = {
  Townsfolk: "blue",
  Outsider: "blue",
  Minion: "red",
  Demon: "red",
  Traveler: "amber",
};

export const alignmentColorMap: Record<Alignment, RadixColor> = {
  Good: "blue",
  Evil: "red",
};
