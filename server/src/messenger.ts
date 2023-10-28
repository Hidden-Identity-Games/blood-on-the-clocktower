import {
  type MessageFromClient,
  type MessageFromServer,
} from "./types/messageShapes.ts";

export function createMessage(message: MessageFromServer): string {
  return JSON.stringify(message);
}

export function parseMessage(message: string): MessageFromClient {
  return JSON.parse(message) as MessageFromClient;
}
