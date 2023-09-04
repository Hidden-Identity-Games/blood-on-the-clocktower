export function apiUrl(path: `/${string}`, options?: { websocket?: boolean }) {
  const url = new URL(`./api${path}`, window.location.origin);
  if (options?.websocket) {
    url.protocol = "ws";
  }
  return url.toString();
}
