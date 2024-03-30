const rateLimits = new Map<string, { timestamp: number, count: number }>();
const windowMs = 10000; // 10 seconds
const maxRequests = 10;

export default function RateLimit(addr: Deno.NetAddr) {
  const now = Date.now();
  let currentEntry = rateLimits.get(addr.hostname);

  if (currentEntry) {
    if (now - currentEntry.timestamp < windowMs) {
      currentEntry.count++;
    } else {
      currentEntry.count = 1;
      currentEntry.timestamp = now;
    }
  } else {
    currentEntry = { timestamp: now, count: 1 };
    rateLimits.set(addr.hostname, currentEntry);
  }

  return currentEntry.count > maxRequests
}
