import { cookies } from "next/headers";
import { createToken, readToken } from "./signing";

export const RESUME_COOKIE = "resume_access";
export const RESUME_ACCESS_SECONDS = 60 * 60 * 12;

export function createAccessToken() {
  return createToken({ exp: Date.now() + RESUME_ACCESS_SECONDS * 1000, scope: "resume" });
}

export async function hasResumeAccess() {
  const store = await cookies();
  const data = readToken<{ exp: number; scope: string }>(store.get(RESUME_COOKIE)?.value);
  return data?.scope === "resume";
}
