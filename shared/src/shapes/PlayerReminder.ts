import { z } from "zod";

export const playerReminderShape = z.object({
  name: z.string(),
  toPlayer: z.string(),
  fromPlayer: z.string(),
});

export const appliedPlayerReminderShape = z.intersection(
  playerReminderShape,
  z.object({ id: z.string(), active: z.boolean(), startNight: z.number() }),
);

export type PlayerReminder = z.TypeOf<typeof playerReminderShape>;
export type AppliedPlayerReminder = z.TypeOf<typeof appliedPlayerReminderShape>;
