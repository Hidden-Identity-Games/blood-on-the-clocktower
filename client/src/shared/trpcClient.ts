import type { AppRouter } from "@hidden-identity/server";
import {
  createTRPCProxyClient,
  httpBatchLink,
  createWSClient,
  wsLink,
  splitLink,
} from "@trpc/client";

const wsClient = createWSClient({
  retryDelayMs: (attemptCount) => attemptCount * attemptCount * 10,
  url: `wss://${WS_URL}`,
});

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    // call subscriptions through websockets and the rest over http
    splitLink({
      condition(op) {
        return op.type === "subscription";
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: `https://${WS_URL}`,
      }),
    }),
  ],
});
