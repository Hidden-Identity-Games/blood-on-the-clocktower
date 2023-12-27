import { z } from "zod";

const archetypeShape = z.enum(["Drunk/Poisoned", "Protected"]);

export const playerReminderShape = z.object({
  reminderText: z.string(),
  fromPlayer: z.string().optional(),
  toPlayer: z.string(),
  startNight: z.number(),
  archetype: archetypeShape.optional(),
});

export const appliedPlayerReminderShape = z.intersection(
  playerReminderShape,
  z.object({ id: z.string(), active: z.boolean() }),
);

export type PlayerReminderArchetype = z.TypeOf<typeof archetypeShape>;
export type PlayerReminder = z.TypeOf<typeof playerReminderShape>;
export type AppliedPlayerReminder = z.TypeOf<typeof appliedPlayerReminderShape>;
