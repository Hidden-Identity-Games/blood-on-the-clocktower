import { MessageFromClient, MessageFromServer } from "@hidden-identity/server";

export function createMessage(message: MessageFromClient) {
  return JSON.stringify(message);
}
export function parseMessage(message: string): MessageFromServer {
  return JSON.parse(message);
}
