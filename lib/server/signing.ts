import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

// Secret used to sign captcha challenges and the résumé access cookie.
// Set SITE_SECRET in production (e.g. in the Vercel project settings) so tokens
// survive restarts and work across serverless instances.
const devSecret = randomBytes(32).toString("hex");

function secret() {
  const value = process.env.SITE_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === "production") throw new Error("SITE_SECRET is not set");
  return devSecret;
}

export function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** Creates `payload.signature`, where payload is base64url JSON. */
export function createToken(data: Record<string, unknown>) {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Returns the token's data when its signature is valid and it has not expired (`exp`, ms). */
export function readToken<T extends { exp: number }>(token: string | undefined): T | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as T;
    return typeof data.exp === "number" && data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}
