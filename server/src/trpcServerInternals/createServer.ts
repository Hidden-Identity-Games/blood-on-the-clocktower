import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";

import { appRouter } from "../appRouter.ts";

export function createServer() {
  const handler = createHTTPHandler({
    middleware: cors(),
    router: appRouter,
    onError: (error) => {
      console.log(error.error.message);
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const server = http.createServer(async (req, res) => {
    try {
      await handler(req, res);
    } catch (e) {
      console.error(e);
    }
  });

  const wss = new WebSocketServer({
    server,
  });

  const wssHandler = applyWSSHandler({ wss, router: appRouter });
  wss.on("connection", (ws) => {
    console.log(`➕➕ Connection (${wss.clients.size})`);
    ws.once("close", () => {
      console.log(`➖➖ Connection (${wss.clients.size})`);
    });
  });

  wss.on("error", (e) => {
    console.error(e);
  });

  server.on("error", (e) => {
    console.error(e);
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM");
    wssHandler.broadcastReconnectNotification();
    wss.close();
  });

  server.listen(process.env.SERVER_PORT);

  console.log(
    `✅ WebSocket Server listening on https://localhost:${process.env.SERVER_PORT}`,
  );

  return server;
}
