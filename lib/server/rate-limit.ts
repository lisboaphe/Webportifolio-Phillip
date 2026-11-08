// Simple in-memory attempt limiter, keyed by client IP.
// On serverless hosting each instance keeps its own counts, so this slows down
// guessing rather than guaranteeing a hard global limit.
type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "local";
}

/** Returns true when this key is still allowed another attempt. */
export function allowAttempt(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 5000) for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k);
  const bucket = buckets.get(key);
  if (!bucket || bucket.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}
