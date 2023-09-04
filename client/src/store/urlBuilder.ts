export function buildUrl(
  absoluteUrl: string,
  options?: { websocket?: boolean },
) {
  return `${options?.websocket ? "ws" : "http"}://${SERVER_URL}${absoluteUrl}`;
}
