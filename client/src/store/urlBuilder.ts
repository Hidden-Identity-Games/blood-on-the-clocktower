export function apiUrl(path: `/${string}`, options?: { websocket?: boolean }) {
  const url = new URL(`./api${path}`, window.location.origin);
  if (options?.websocket) {
    url.protocol = window.location.protocol.startsWith("https") ? "wss" : "ws";
  }
  return url.toString();
}
