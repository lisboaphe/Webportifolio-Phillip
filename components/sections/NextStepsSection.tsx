"use client";

import { useState } from "react";

type Status = "done" | "progress" | "ongoing" | "planned";
type RoadmapItem = { text: string; status: Status; percent?: number };

const steps: { label: string; title: string; text: string; roadmap: RoadmapItem[] }[] = [
  {
    label: "Building now",
    title: "This portfolio",
    text: "Refining the interface, animations and individual sections into a personal home for my work.",
    roadmap: [
      { text: "Constant updates to design and projects", status: "ongoing" },
      { text: "Security headers & clickjacking protection", status: "done" },
      { text: "Password-protected résumé", status: "done" },
      { text: "Contact form with captcha & rate limiting", status: "done" },
    ],
  },
  {
    label: "Learning next",
    title: "Linux, networking & security",
    text: "Continuing to learn through systems, virtual machines, security tools and hands-on experimentation.",
    roadmap: [
      { text: "Understanding TCP/IP & DNS", status: "done", percent: 100 },
      { text: "Small Python scripts", status: "progress" },
      { text: "Information gathering & reconnaissance (Wireshark & Nmap)", status: "progress", percent: 50 },
      { text: "Web application analysis (Burp Suite)", status: "progress" },
    ],
  },
  {
    label: "Coming up",
    title: "Sharing the process",
    text: "Adding project write-ups and documenting what I build and learn.",
    roadmap: [
      { text: "Project write-ups", status: "planned" },
      { text: "Documenting labs & learnings", status: "planned" },
    ],
  },
];

const statusLabel: Record<Status, string> = { done: "Completed", progress: "In progress", ongoing: "Ongoing", planned: "Planned" };

function StatusMark({ status }: { status: Status }) {
  return (
    <span className={`roadmap-mark is-${status}`} aria-hidden="true">
      {status === "done" ? (
        <svg viewBox="0 0 16 16" width="12" height="12"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : status === "ongoing" ? (
        <svg viewBox="0 0 16 16" width="12" height="12"><path d="M13 8a5 5 0 1 1-1.5-3.5M13 3v2.5h-2.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : null}
    </span>
  );
}

export function NextStepsSection() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section>
      <p className="eyebrow">Next steps</p>
      <h2>A little further, every day.</h2>
      <p className="next-intro">What I’m building now and where I’d like to go next. Hover a card to see its roadmap.</p>
      <div className="next-grid">
        {steps.map((step) => {
          const done = step.roadmap.filter((item) => item.status === "done").length;
          const isOpen = open === step.label;
          return (
            <article
              className={`content-glass next-card ${isOpen ? "is-open" : ""}`}
              key={step.label}
              tabIndex={0}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : step.label)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpen(isOpen ? null : step.label);
                }
              }}
            >
              <div className="next-card-top">
                <p className="eyebrow">{step.label}</p>
                <span className="roadmap-count">{done}/{step.roadmap.length}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <div className="roadmap">
                <div>
                  <p className="roadmap-title">Roadmap</p>
                  <ul>
                    {step.roadmap.map((item) => (
                      <li key={item.text} className={`is-${item.status}`}>
                        <StatusMark status={item.status} />
                        <div className="roadmap-body">
                          <span className="roadmap-text">{item.text}</span>
                          <span className="roadmap-status">
                            {statusLabel[item.status]}
                            {item.percent !== undefined && ` · ${item.percent}%`}
                          </span>
                          {item.percent !== undefined && (
                            <span className="roadmap-bar" role="progressbar" aria-valuenow={item.percent} aria-valuemin={0} aria-valuemax={100} aria-label={item.text}>
                              <span style={{ width: `${item.percent}%` }} />
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
