/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AppRouter } from "@hidden-identity/server";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import fetch, { Headers, Request, Response } from "node-fetch";

if (!globalThis.fetch) {
  (globalThis as any).fetch = fetch;
  (globalThis as any).Headers = Headers;
  (globalThis as any).Request = Request;
  (globalThis as any).Response = Response;
}
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `http://localhost:6001`,
    }),
  ],
});
