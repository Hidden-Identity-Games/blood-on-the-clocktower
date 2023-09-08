import { MessageFromClient, MessageFromServer } from "@hidden-identity/server";

export function createMessage(message: MessageFromClient) {
  return message;
}
export function parseMessage(message: NonNullable<unknown>): MessageFromServer {
  return message as MessageFromServer;
}
