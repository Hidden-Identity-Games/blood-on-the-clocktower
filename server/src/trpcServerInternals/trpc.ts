import { initTRPC } from "@trpc/server";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
export const trpcBase = initTRPC.create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = trpcBase.router;
export const publicProcedure = trpcBase.procedure;

export const playerProcedure = trpcBase.procedure;
export const gmProcedure = trpcBase.procedure;
