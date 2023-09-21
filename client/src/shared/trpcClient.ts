import type { AppRouter } from "@hidden-identity/server/server";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/trpc",
    }),
  ],
});
