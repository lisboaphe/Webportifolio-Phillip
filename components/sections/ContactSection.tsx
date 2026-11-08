"use client";

import { FormEvent, useEffect, useState } from "react";

type Challenge = { image: string; token: string };
type Field = "name" | "email" | "message" | "captcha";

export function ContactSection() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "", answer: "", website: "" });
  const [error, setError] = useState<{ field?: Field; text: string } | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const load = async () => {
    setChallenge(null);
    try {
      const res = await fetch("/api/contact", { cache: "no-store" });
      setChallenge((await res.json()) as Challenge);
    } catch {
      setError({ field: "captcha", text: "Could not load the captcha." });
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const update = (key: keyof typeof form) => (event: { target: { value: string } }) =>
    setForm((current) => ({ ...current, [key]: key === "answer" ? event.target.value.replace(/\D/g, "").slice(0, 3) : event.target.value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!challenge || state === "sending") return;
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, token: challenge.token }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; field?: Field } & Partial<Challenge>;
      if (data.ok) {
        setState("sent");
        return;
      }
      setError({ field: data.field, text: data.error || "Something went wrong." });
      if (data.image && data.token) setChallenge({ image: data.image, token: data.token });
      setForm((current) => ({ ...current, answer: "" }));
    } catch {
      setError({ text: "Something went wrong. Please try again." });
    }
    setState("idle");
  };

  const invalid = (field: Field) => error?.field === field;

  return (
    <section className="contact-content">
      <p className="eyebrow">Contact</p>
      <h2>Send me a message</h2>
      <p className="next-intro">Questions, opportunities or just want to say hi? Write me here and I’ll answer by email.</p>

      {state === "sent" ? (
        <div className="content-glass contact-form contact-sent" role="status">
          <h3>Thanks, your message is on its way!</h3>
          <p>I’ll get back to you at the email address you gave me.</p>
        </div>
      ) : (
        <form className="content-glass contact-form" onSubmit={submit} noValidate>
          <div className="contact-form-grid">
            <label>
              <span>Name</span>
              <input value={form.name} onChange={update("name")} autoComplete="name" maxLength={100} required aria-invalid={invalid("name")} />
            </label>
            <label>
              <span>Your email</span>
              <input type="email" value={form.email} onChange={update("email")} autoComplete="email" maxLength={200} required aria-invalid={invalid("email")} />
            </label>
          </div>
          <label>
            <span>Message</span>
            <textarea value={form.message} onChange={update("message")} rows={6} maxLength={3000} required aria-invalid={invalid("message")} />
          </label>
          {/* Honeypot: hidden from people, filled in by bots. */}
          <label className="contact-honeypot" aria-hidden="true">
            Website <input tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} />
          </label>
          <div className="contact-form-footer">
            <div className="contact-captcha">
              {challenge ? <img className="captcha-image" src={challenge.image} alt="Captcha: add the two numbers shown" /> : <span className="captcha-image captcha-loading" />}
              <button type="button" className="captcha-icon" onClick={() => void load()} aria-label="New captcha" title="New captcha">↻</button>
              <label className="sr-only" htmlFor="contact-answer">Captcha answer</label>
              <input id="contact-answer" inputMode="numeric" autoComplete="off" placeholder="Answer" value={form.answer} onChange={update("answer")} aria-invalid={invalid("captcha")} />
            </div>
            <button type="submit" className="contact-send" disabled={state === "sending" || !challenge || !form.answer}>
              {state === "sending" ? "Sending…" : "Send message"}
            </button>
          </div>
          {error && <p className="form-error" role="alert">{error.text}</p>}
        </form>
      )}
    </section>
  );
}
