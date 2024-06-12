export function extractPortFromUrl(url) {
  const regex = /https?:\/\/[^:]+:(\d+)/;
  const match = url.match(regex);

  if (match) return Number(match[1]);
  return null;
}
