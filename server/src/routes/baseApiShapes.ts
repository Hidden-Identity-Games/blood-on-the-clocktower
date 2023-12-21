import { z } from "zod";

export const gameIdShape = z.object({ gameId: z.string() });
export const playerIdShape = z.object({ player: z.string() });
export const playerAndGameIdShape = z.intersection(playerIdShape, gameIdShape);
