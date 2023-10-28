import { z } from "zod";
import { type Role } from "@hidden-identity/shared";

export const gameIdShape = z.object({ gameId: z.string() });
export const playerIdShape = z.object({ player: z.string() });
export const roleShape = z.string().refine<Role>((_arg): _arg is Role => true);
export const playerAndGameIdShape = z.intersection(playerIdShape, gameIdShape);
