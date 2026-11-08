"use client";

import { FormEvent, useEffect, useState } from "react";
import { site } from "@/data/portfolio-content";

type State = "checking" | "locked" | "unlocked";

export function ResumeSection() {
  const [state, setState] = useState<State>("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/resume", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { unlocked?: boolean }) => setState(data.unlocked ? "unlocked" : "locked"))
      .catch(() => setState("locked"));
  }, []);

  const unlock = async (event: FormEvent) => {
    event.preventDefault();
    if (!password || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (data.ok) {
        setState("unlocked");
        setPassword("");
      } else setError(data.error || "Wrong password.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const lock = async () => {
    await fetch("/api/resume", { method: "DELETE" }).catch(() => undefined);
    setState("locked");
  };

  return (
    <section className="resume-content">
      <p className="eyebrow">Résumé</p>
      <h2>Phillip Lisboa</h2>
      <p className="resume-subtitle">Wirtschaftsinformatik Student · Developer · Cybersecurity Enthusiast</p>
      <div className="content-glass resume-summary">
        <h3>Development, systems & security</h3>
        <p>Building modern web experiences with React, Next.js and Tailwind CSS.</p>
        <p>Hands-on experience with Linux, VMs, troubleshooting and system customization.</p>
        <p>Learning security through networking, tools, labs and hands-on experimentation.</p>
      </div>

      {state === "unlocked" ? (
        <div className="cv-unlocked">
          <div className="cv-languages" aria-label="CV languages">
            {site.resumes.map((cv) => (
              <a className="resume-download" key={cv.lang} href={cv.url} hrefLang={cv.lang} target="_blank" rel="noopener noreferrer">
                CV · {cv.language}
              </a>
            ))}
          </div>
          <button type="button" className="cv-lock" onClick={lock}>Lock again</button>
        </div>
      ) : (
        <form className="content-glass cv-gate" onSubmit={unlock}>
          <div className="cv-gate-head">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
              <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <h3>CV download is password protected</h3>
          </div>
          <p>Got a password from me? Enter it to open the English and German CV. Otherwise, reach out through Contact and I’ll send it over.</p>
          <div className="cv-gate-row">
            <label className="sr-only" htmlFor="cv-password">Résumé password</label>
            <input
              id="cv-password"
              type="password"
              autoComplete="off"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={state === "checking"}
              aria-invalid={!!error}
              aria-describedby={error ? "cv-error" : undefined}
            />
            <button type="submit" disabled={!password || submitting || state === "checking"}>
              {submitting ? "Checking…" : "Unlock"}
            </button>
          </div>
          {error && <p id="cv-error" className="form-error" role="alert">{error}</p>}
        </form>
      )}
    </section>
  );
}
