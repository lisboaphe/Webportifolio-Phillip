// Sends contact-form messages through Resend (https://resend.com).
// Needs RESEND_API_KEY. The recipient stays on the server, never in the page.
const TO = process.env.CONTACT_TO_EMAIL || "lisboaphe@gmail.com";
// onboarding@resend.dev works without a domain, but only delivers to the
// email address of your own Resend account. Use your own domain later.
const FROM = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

export async function sendContactEmail({ name, email, message }: { name: string; email: string; message: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY not set; message not sent:", { name, email, message });
      return { ok: true as const };
    }
    return { ok: false as const, error: "Messaging isn’t set up yet. Please reach out on LinkedIn." };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: email,
      subject: `Portfolio message from ${name.replace(/[\r\n]+/g, " ")}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  }).catch(() => null);

  if (!res?.ok) {
    console.error("[contact] Resend failed", res?.status, await res?.text().catch(() => ""));
    return { ok: false as const, error: "The message couldn’t be sent right now. Please try again later." };
  }
  return { ok: true as const };
}
