import { NextResponse } from "next/server";
import { createChallenge, verifyChallenge } from "@/lib/server/captcha";
import { allowAttempt, clientIp } from "@/lib/server/rate-limit";
import { sendContactEmail } from "@/lib/server/send-email";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };
const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;

type Body = { token?: string; answer?: string; name?: string; email?: string; message?: string; website?: string };

/** New captcha challenge. */
export function GET() {
  return NextResponse.json(createChallenge(), { headers: noStore });
}

/** Send a message to Phillip. Needs a solved captcha. */
export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!allowAttempt(`captcha:${ip}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many tries. Please wait a few minutes." }, { status: 429, headers: noStore });
  }

  const body = (await request.json().catch(() => ({}))) as Body;
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  // Hidden "website" field: people never fill it, simple bots do. Pretend success.
  if (body.website) return NextResponse.json({ ok: true }, { headers: noStore });

  if (!name || name.length > 100) return NextResponse.json({ ok: false, field: "name", error: "Please enter your name." }, { status: 400, headers: noStore });
  if (!EMAIL_PATTERN.test(email) || email.length > 200) return NextResponse.json({ ok: false, field: "email", error: "Please enter a valid email address." }, { status: 400, headers: noStore });
  if (message.length < 10 || message.length > 3000) return NextResponse.json({ ok: false, field: "message", error: "Your message should be 10–3000 characters." }, { status: 400, headers: noStore });

  if (!verifyChallenge(body.token, String(body.answer ?? ""))) {
    return NextResponse.json({ ok: false, field: "captcha", error: "The captcha answer was wrong. Try this one.", ...createChallenge() }, { status: 400, headers: noStore });
  }

  if (!allowAttempt(`message:${ip}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "You’ve sent a few messages already. Please try again later." }, { status: 429, headers: noStore });
  }

  const result = await sendContactEmail({ name, email, message });
  if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: 503, headers: noStore });
  return NextResponse.json({ ok: true }, { headers: noStore });
}
