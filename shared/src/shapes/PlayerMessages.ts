import { z } from "zod";
import { CharacterTypes, alignmentShape, roleShape } from "./Role.ts";

export const playerMessageEntryShape = z.object({
  character: roleShape.optional(),
  player: z.ostring(),
  team: z.enum(CharacterTypes).optional(),
  alignment: alignmentShape.optional(),
  message: z.ostring(),
  group: z.string(),
});
export const playerMessageShape = z.object({
  id: z.string(),
  player: z.string(),
  messages: z.array(playerMessageEntryShape),
});

export type PlayerMessage = z.TypeOf<typeof playerMessageShape>;
export type PlayerMessageEntry = z.TypeOf<typeof playerMessageEntryShape>;