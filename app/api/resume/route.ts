import { NextResponse } from "next/server";
import { safeEqual } from "@/lib/server/signing";
import { allowAttempt, clientIp } from "@/lib/server/rate-limit";
import { RESUME_ACCESS_SECONDS, RESUME_COOKIE, createAccessToken, hasResumeAccess } from "@/lib/server/resume-access";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

/** Whether this visitor has already unlocked the résumé. */
export async function GET() {
  return NextResponse.json({ unlocked: await hasResumeAccess() }, { headers: noStore });
}

/** Unlock with the résumé password (RESUME_PASSWORD env var). */
export async function POST(request: Request) {
  const expected = process.env.RESUME_PASSWORD;
  if (!expected) return NextResponse.json({ ok: false, error: "Résumé access is not configured yet." }, { status: 503, headers: noStore });

  if (!allowAttempt(`resume:${clientIp(request)}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please try again in 15 minutes." }, { status: 429, headers: noStore });
  }
  const body = (await request.json().catch(() => ({}))) as { password?: string };
  const password = String(body.password ?? "");
  // Small delay to slow down guessing.
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (!safeEqual(password, expected)) {
    return NextResponse.json({ ok: false, error: "Wrong password." }, { status: 401, headers: noStore });
  }

  const response = NextResponse.json({ ok: true }, { headers: noStore });
  response.cookies.set(RESUME_COOKIE, createAccessToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: RESUME_ACCESS_SECONDS,
  });
  return response;
}

/** Lock again. */
export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { headers: noStore });
  response.cookies.delete(RESUME_COOKIE);
  return response;
}
